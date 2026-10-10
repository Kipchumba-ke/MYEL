-- MYEL store schema for Supabase.
-- Run in Supabase SQL Editor as a project owner.
-- IMPORTANT: never put the service_role key in frontend code.

create extension if not exists pgcrypto;

create type public.app_role as enum ('customer', 'admin');
create type public.order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Necklaces','Rings','Bracelets','Earrings')),
  price numeric(10,2) not null check (price >= 0),
  image_url text not null,
  description text not null default '',
  featured boolean not null default false,
  active boolean not null default true,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  total numeric(10,2) not null check (total >= 0),
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Profiles: users can read/update their own profile but cannot change their role.
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or public.is_admin());
create policy "profiles_update_own_basic" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
-- Protect role from self-promotion using a trigger.
create function public.protect_profile_role()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an administrator may change account roles';
  end if;
  return new;
end;
$$;
create trigger protect_profile_role_before_update before update on public.profiles
for each row execute procedure public.protect_profile_role();

-- Public visitors can read active products; admins can manage the full catalogue.
create policy "products_public_read_active" on public.products
  for select to anon, authenticated using (active = true or public.is_admin());
create policy "products_admin_insert" on public.products
  for insert to authenticated with check (public.is_admin());
create policy "products_admin_update" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products_admin_delete" on public.products
  for delete to authenticated using (public.is_admin());

-- Customers can view their own orders; admins can see and manage all orders.
create policy "orders_read_own_or_admin" on public.orders
  for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
create policy "orders_customer_create" on public.orders
  for insert to authenticated with check (user_id = (select auth.uid()) and status = 'pending');
create policy "orders_admin_update" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "order_items_read_own_or_admin" on public.order_items
  for select to authenticated using (
    public.is_admin() or exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = (select auth.uid())
    )
  );
create policy "order_items_customer_insert_own_pending" on public.order_items
  for insert to authenticated with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = (select auth.uid()) and o.status = 'pending'
    )
  );
-- Admins can also manage order line items if needed.
create policy "order_items_admin_manage" on public.order_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
grant select, update on public.profiles to authenticated;

-- Promote your own first account to admin only after registering it in Supabase Auth.
-- Run this separately, replacing with your account email:
-- update public.profiles p set role = 'admin'
-- from auth.users u where p.id = u.id and u.email = 'you@example.com';

-- Seed a few products. Replace image URLs with approved MYEL assets before launch.
insert into public.products (name, category, price, image_url, description, featured, active, stock) values
('Stein Necklace in Silver with Aquamarine', 'Necklaces', 245, 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=85', 'A delicate silver necklace set with luminous aquamarine.', true, true, 8),
('Origines Pendant in Yellow Gold', 'Necklaces', 390, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85', 'An everyday pendant crafted with a thoughtful eye for detail.', true, true, 5),
('Ethical Gold Signet Ring', 'Rings', 320, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85', 'A modern signet ring with a timeless silhouette.', false, true, 6),
('Pearl Chain Bracelet', 'Bracelets', 185, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=85', 'A fine gold-tone chain accented with pearls.', true, true, 12),
('Sculpted Gold Hoop Earrings', 'Earrings', 210, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85', 'Sculptural hoops designed for everyday wear.', false, true, 9);
