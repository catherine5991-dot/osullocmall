-- 오설록 차 상품 목록
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  -- 취향 파인더 결과 화면 / 상세페이지에 노출할 제주 헤리티지 한 줄 카피
  heritage_copy text,
  price integer not null default 0,
  -- 베이스(단일 선택): 녹차·말차·호지차 / 홍차·발효차 / 허브
  base text not null check (base in ('녹차/말차/호지차', '홍차/발효차', '허브')),
  -- 제형(단일 선택)
  format text not null check (format in ('잎차', '피라미드티백', '종이티백', '찬물스틱티백', '가루차', '세트')),
  is_caffeine_free boolean not null default false,
  -- 유기농 체크박스는 실제 인증이 확인된 상품에만 true로 부여할 것 (프로토타입 더미 데이터는 임의 지정)
  is_organic boolean not null default false,
  created_at timestamptz not null default now()
);

-- 필터 화면의 다중 선택 분류: 맛과 향 / 원물 / 상황
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('flavor_aroma', 'raw_material', 'situation')),
  name text not null,
  unique (category, name)
);

-- 상품 ↔ 태그 다대다 연결
create table public.product_tags (
  product_id uuid not null references public.products(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

-- 상품 카탈로그는 누구나 읽을 수 있어야 하므로 공개 조회 정책을 추가
alter table public.products enable row level security;
alter table public.tags enable row level security;
alter table public.product_tags enable row level security;

create policy "Public can view products" on public.products
  for select using (true);

create policy "Public can view tags" on public.tags
  for select using (true);

create policy "Public can view product_tags" on public.product_tags
  for select using (true);
