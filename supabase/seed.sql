-- 필터용 태그 (맛과 향 / 원물 / 상황)
insert into public.tags (category, name) values
  ('flavor_aroma', '시트러스'),
  ('flavor_aroma', '플로럴'),
  ('flavor_aroma', '너티'),
  ('flavor_aroma', '프루티'),
  ('flavor_aroma', '허벌'),
  ('raw_material', '배'), ('raw_material', '귤'), ('raw_material', '복숭아'),
  ('raw_material', '무화과'), ('raw_material', '사과'), ('raw_material', '머스캣'),
  ('raw_material', '체리'), ('raw_material', '밤'), ('raw_material', '꿀'),
  ('raw_material', '동백꽃'), ('raw_material', '귤꽃'), ('raw_material', '캐모마일'),
  ('raw_material', '히비스커스'), ('raw_material', '민트'),
  ('situation', '아침을 깨워주는'), ('situation', '운동 후 상쾌하게'),
  ('situation', '늦은 오후 차분하게'), ('situation', '식사 후 개운하게'),
  ('situation', '디저트와 함께'), ('situation', '피곤할 때');

-- 순수차 (녹차/말차/호지차 베이스)
insert into public.products (name, description, heritage_copy, price, base, format, is_caffeine_free, is_organic) values
  ('제주 순수 녹차', '산뜻하고 가벼운 풍미의 녹차', '제주 화산토 다원에서 자란 찻잎을 그대로 덖어 만들었어요', 12000, '녹차/말차/호지차', '잎차', false, true),
  ('프리미엄 말차', '고소하고 진한 말차 본연의 맛', '제주 다원에서 자란 찻잎을 그대로 갈아만든 순수 말차예요', 28000, '녹차/말차/호지차', '가루차', false, true),
  ('마스터즈 말차', '더 진하고 깊은 말차 애호가용', '제주 차밭의 햇볕을 가장 오래 머금은 잎으로 만들었어요', 35000, '녹차/말차/호지차', '가루차', false, false),
  ('제주 호지차', '구수하고 편안한 볶음차', '제주에서 덖어낸 찻잎을 다시 한 번 은은하게 볶았어요', 13000, '녹차/말차/호지차', '잎차', false, false),
  ('세작', '어린 찻잎으로 만든 섬세한 맛의 녹차', '제주 다원에서 이른 봄 가장 여린 잎만 골라 덖었어요', 18000, '녹차/말차/호지차', '잎차', false, true),
  ('일로향', '은은하고 깔끔한 향의 녹차', '제주 화산토가 키운 찻잎의 맑은 향을 그대로 담았어요', 15000, '녹차/말차/호지차', '잎차', false, false),
  ('우전', '가장 이른 수확의 귀한 녹차', '곡우 전에 딴 첫 찻잎으로 만든 가장 귀한 녹차예요', 25000, '녹차/말차/호지차', '잎차', false, true);

-- 발효차/홍차
insert into public.products (name, description, heritage_copy, price, base, format, is_caffeine_free, is_organic) values
  ('제주 홍차', '향이 깊고 진한 발효차', '제주의 습하고 따뜻한 바람 속에서 천천히 발효된 찻잎이에요', 14000, '홍차/발효차', '잎차', false, false),
  ('얼그레이', '베르가못 향이 더해진 홍차', '제주산 홍차에 향긋한 베르가못을 더했어요', 15000, '홍차/발효차', '피라미드티백', false, false);

-- 밀크티류 (10종, 음료형 - 우유와 함께)
insert into public.products (name, description, heritage_copy, price, base, format, is_caffeine_free, is_organic) values
  ('제주말차 밀크티', '진한 말차와 부드러운 우유의 조화', '제주 다원의 말차를 우유에 듬뿍 녹였어요', 9000, '녹차/말차/호지차', '찬물스틱티백', false, false),
  ('얼그레이 밀크티', '홍차 향 가득한 밀크티', '제주산 홍차의 깊은 향을 우유와 함께 즐겨보세요', 9000, '홍차/발효차', '찬물스틱티백', false, false),
  ('제주호지차 밀크티', '구수한 호지차 밀크티', '제주에서 볶아낸 호지차를 우유와 함께 담았어요', 9000, '녹차/말차/호지차', '찬물스틱티백', false, false),
  ('호지샷 블렌드', '진한 호지차 샷 블렌드', '제주 다원의 호지차를 더 진하게 추출했어요', 10000, '녹차/말차/호지차', '세트', false, false),
  ('말차샷 블렌드', '진한 말차 샷 블렌드', '제주 다원의 말차를 더 진하게 추출했어요', 10000, '녹차/말차/호지차', '세트', false, false),
  ('삼다연 오리지널 밀크티', '오설록 대표 밀크티', '제주의 차향을 가장 편하게 담은 밀크티예요', 9500, '홍차/발효차', '찬물스틱티백', false, false),
  ('제주말차 오트블렌드', '오트밀크와 어우러진 말차', '제주 말차에 고소한 오트밀크를 더했어요', 9500, '녹차/말차/호지차', '찬물스틱티백', false, false),
  ('가루녹차', '우유에 타 먹는 가루 녹차', '제주 다원의 찻잎을 곱게 갈았어요', 11000, '녹차/말차/호지차', '가루차', false, true),
  ('프리미엄말차 밀크용', '밀크티 전용 말차', '진한 풍미를 위해 엄선한 제주 말차예요', 15000, '녹차/말차/호지차', '가루차', false, true),
  ('마스터즈말차 밀크용', '최상급 밀크티 전용 말차', '제주 다원 최상급 찻잎으로 만들었어요', 20000, '녹차/말차/호지차', '가루차', false, false);

-- 콜드류 (13종, 음료형 - 가볍고 시원한)
insert into public.products (name, description, heritage_copy, price, base, format, is_caffeine_free, is_organic) values
  ('말차플러스 그린', '가볍게 즐기는 말차 음료', '제주 말차를 시원하게 즐길 수 있도록 만들었어요', 8000, '녹차/말차/호지차', '찬물스틱티백', false, false),
  ('말차플러스 유자', '유자향 더한 말차 음료', '제주 말차에 상큼한 유자를 더했어요', 8500, '녹차/말차/호지차', '찬물스틱티백', false, false),
  ('말차플러스 자몽', '자몽향 더한 말차 음료', '제주 말차에 새콤한 자몽을 더했어요', 8500, '녹차/말차/호지차', '찬물스틱티백', false, false),
  ('콤부차 애플민트', '상큼한 발효 음료', '제주에서 공수한 민트로 향을 더했어요', 9000, '허브', '찬물스틱티백', true, false),
  ('콤부차 베리', '새콤달콤 발효 음료', '제주 자연에서 영감을 받은 베리 블렌드예요', 9000, '허브', '찬물스틱티백', true, false),
  ('콤부차 레몬', '상큼한 레몬 발효 음료', '깔끔한 레몬향의 콤부차예요', 9000, '허브', '찬물스틱티백', true, false),
  ('콜드브루 녹차', '시원하게 우린 녹차', '제주 녹차를 차갑게 오래 우렸어요', 8500, '녹차/말차/호지차', '찬물스틱티백', false, false),
  ('콜드브루 홍차', '시원하게 우린 홍차', '제주 홍차를 차갑게 오래 우렸어요', 8500, '홍차/발효차', '찬물스틱티백', false, false),
  ('콜드브루 자스민', '은은한 자스민 향', '제주에서 블렌딩한 자스민 향 콜드브루예요', 8500, '녹차/말차/호지차', '찬물스틱티백', false, false),
  ('콜드브루 페퍼민트', '시원한 민트 향', '상쾌한 민트로 더위를 식혀줘요', 8500, '허브', '찬물스틱티백', true, false),
  ('콜드브루 히비스커스', '새콤한 히비스커스', '제주의 여름을 닮은 새콤한 음료예요', 8500, '허브', '찬물스틱티백', true, false),
  ('찬물 녹차 스틱', '찬물에 바로 타는 녹차', '제주 녹차를 간편하게 즐길 수 있어요', 10000, '녹차/말차/호지차', '찬물스틱티백', false, true),
  ('찬물 호지차 스틱', '찬물에 바로 타는 호지차', '제주 호지차를 간편하게 즐길 수 있어요', 10000, '녹차/말차/호지차', '찬물스틱티백', false, false);

-- 블렌디드 (시트러스/플로럴/너티/프루티/허벌 각 1~2종)
insert into public.products (name, description, heritage_copy, price, base, format, is_caffeine_free, is_organic) values
  ('제주 유자 블렌드', '상큼한 시트러스 향', '제주산 유자 향을 더한 블렌디드 티예요', 13000, '홍차/발효차', '종이티백', false, false),
  ('동백꽃 블렌드', '화사한 꽃향의 블렌디드', '제주 동백꽃 향을 담은 티예요', 14000, '홍차/발효차', '종이티백', false, false),
  ('호두 너티 블렌드', '구수하고 고소한 너티향', '제주산 녹차에 고소한 향을 더했어요', 13500, '녹차/말차/호지차', '종이티백', false, false),
  ('제주 복숭아 블렌드', '달콤한 프루티향', '제주 햇살을 닮은 복숭아향을 더했어요', 13000, '홍차/발효차', '종이티백', false, false),
  ('허벌 블렌드 캐모마일민트', '은은하고 편안한 허벌향', '제주 자연에서 영감을 받은 허브 블렌드예요', 13000, '허브', '종이티백', true, false);

-- 허브티 (순수허브 + 블렌디드허브)
insert into public.products (name, description, heritage_copy, price, base, format, is_caffeine_free, is_organic) values
  ('루이보스 퓨어', '깔끔한 루이보스 본연의 맛', '카페인 걱정 없이 편안하게 즐기는 차예요', 12000, '허브', '잎차', true, true),
  ('찬물 루이보스티', '찬물에 바로 즐기는 루이보스', '언제 어디서든 편안하게 즐겨보세요', 11000, '허브', '찬물스틱티백', true, true),
  ('피치 캐모마일', '은은한 복숭아향 허브티', '편안한 캐모마일에 달콤한 복숭아향을 더했어요', 12500, '허브', '피라미드티백', true, false),
  ('캐모마일 블렌드', '편안한 캐모마일 향', '제주의 밤처럼 편안한 휴식을 선사해요', 12000, '허브', '피라미드티백', true, false),
  ('스윗 히비스커스', '달콤한 과일향 허브티', '새콤달콤한 히비스커스 본연의 매력이에요', 12500, '허브', '피라미드티백', true, false),
  ('체리 루이보스', '달콤한 체리향 루이보스', '루이보스에 상큼달콤한 체리향을 더했어요', 13000, '허브', '피라미드티백', true, false),
  ('캐모마일 로지피치', '장미와 복숭아향 허브티', '은은한 장미향과 복숭아향의 조화예요', 13000, '허브', '피라미드티백', true, false),
  ('멜로우 민트', '부드러운 민트향 허브티', '편안하고 부드러운 민트 블렌드예요', 12000, '허브', '피라미드티백', true, false),
  ('루이보스 문라이트', '은은한 과일향 루이보스', '제주의 밤하늘을 닮은 부드러운 블렌드예요', 13000, '허브', '피라미드티백', true, false),
  ('루이보스 체리벨벳', '벨벳처럼 부드러운 체리향', '깊고 부드러운 체리향의 루이보스예요', 13000, '허브', '피라미드티백', true, false),
  ('히비스커스 콜드브루', '새콤한 히비스커스 콜드브루', '여름에 어울리는 새콤한 블렌드예요', 10000, '허브', '찬물스틱티백', true, false),
  ('페퍼민트 브리즈', '시원한 페퍼민트 본연의 향', '제주 바람처럼 시원한 민트향이에요', 11500, '허브', '피라미드티백', true, true),
  ('캐모마일 라벤더', '플로럴한 허브 본연의 향', '편안한 라벤더와 캐모마일의 조화예요', 12500, '허브', '피라미드티백', true, false),
  ('바질 보타닉 가든', '풀향 가득한 허브 본연의 향', '싱그러운 바질과 허브의 정원을 담았어요', 12500, '허브', '피라미드티백', true, false);

-- 세트 상품 (제형: 세트)
insert into public.products (name, description, heritage_copy, price, base, format, is_caffeine_free, is_organic) values
  ('제주 티 컬렉션 세트', '오설록 대표 차 모음 세트', '제주 다원의 다양한 찻잎을 한 번에 만나보세요', 32000, '녹차/말차/호지차', '세트', false, false),
  ('허브티 선물 세트', '편안한 허브티 모음 세트', '제주의 포근함을 담은 허브 선물이에요', 29000, '허브', '세트', true, false);

-- 상품-태그 연결 (일부 예시, name으로 매칭)
insert into public.product_tags (product_id, tag_id)
select p.id, t.id from public.products p, public.tags t
where (p.name = '제주 유자 블렌드' and t.name = '시트러스')
   or (p.name = '제주 유자 블렌드' and t.name = '귤')
   or (p.name = '동백꽃 블렌드' and t.name = '플로럴')
   or (p.name = '동백꽃 블렌드' and t.name = '동백꽃')
   or (p.name = '호두 너티 블렌드' and t.name = '너티')
   or (p.name = '호두 너티 블렌드' and t.name = '밤')
   or (p.name = '제주 복숭아 블렌드' and t.name = '프루티')
   or (p.name = '제주 복숭아 블렌드' and t.name = '복숭아')
   or (p.name = '허벌 블렌드 캐모마일민트' and t.name = '허벌')
   or (p.name = '허벌 블렌드 캐모마일민트' and t.name = '캐모마일')
   or (p.name = '허벌 블렌드 캐모마일민트' and t.name = '민트')
   or (p.name = '피치 캐모마일' and t.name = '프루티')
   or (p.name = '피치 캐모마일' and t.name = '복숭아')
   or (p.name = '피치 캐모마일' and t.name = '캐모마일')
   or (p.name = '캐모마일 블렌드' and t.name = '허벌')
   or (p.name = '캐모마일 블렌드' and t.name = '캐모마일')
   or (p.name = '스윗 히비스커스' and t.name = '프루티')
   or (p.name = '스윗 히비스커스' and t.name = '히비스커스')
   or (p.name = '체리 루이보스' and t.name = '프루티')
   or (p.name = '체리 루이보스' and t.name = '체리')
   or (p.name = '캐모마일 로지피치' and t.name = '프루티')
   or (p.name = '캐모마일 로지피치' and t.name = '복숭아')
   or (p.name = '멜로우 민트' and t.name = '허벌')
   or (p.name = '멜로우 민트' and t.name = '민트')
   or (p.name = '루이보스 문라이트' and t.name = '프루티')
   or (p.name = '루이보스 체리벨벳' and t.name = '프루티')
   or (p.name = '루이보스 체리벨벳' and t.name = '체리')
   or (p.name = '히비스커스 콜드브루' and t.name = '시트러스')
   or (p.name = '히비스커스 콜드브루' and t.name = '히비스커스')
   or (p.name = '페퍼민트 브리즈' and t.name = '허벌')
   or (p.name = '페퍼민트 브리즈' and t.name = '민트')
   or (p.name = '캐모마일 라벤더' and t.name = '플로럴')
   or (p.name = '캐모마일 라벤더' and t.name = '캐모마일')
   or (p.name = '바질 보타닉 가든' and t.name = '허벌')
   or (p.name = '콤부차 애플민트' and t.name = '허벌')
   or (p.name = '콤부차 애플민트' and t.name = '민트')
   or (p.name = '콤부차 베리' and t.name = '프루티')
   or (p.name = '콤부차 레몬' and t.name = '시트러스')
   or (p.name = '콜드브루 자스민' and t.name = '플로럴')
   or (p.name = '콜드브루 페퍼민트' and t.name = '허벌')
   or (p.name = '콜드브루 페퍼민트' and t.name = '민트')
   or (p.name = '콜드브루 히비스커스' and t.name = '시트러스')
   or (p.name = '콜드브루 히비스커스' and t.name = '히비스커스')
   or (p.name = '프리미엄 말차' and t.name = '너티')
   or (p.name = '제주 호지차' and t.name = '너티');

-- 상황(situation) 태그 일부 연결
insert into public.product_tags (product_id, tag_id)
select p.id, t.id from public.products p, public.tags t
where (p.name = '제주 순수 녹차' and t.name = '아침을 깨워주는')
   or (p.name = '프리미엄 말차' and t.name = '아침을 깨워주는')
   or (p.name = '콤부차 애플민트' and t.name = '운동 후 상쾌하게')
   or (p.name = '콜드브루 페퍼민트' and t.name = '운동 후 상쾌하게')
   or (p.name = '루이보스 퓨어' and t.name = '늦은 오후 차분하게')
   or (p.name = '캐모마일 블렌드' and t.name = '늦은 오후 차분하게')
   or (p.name = '제주 호지차' and t.name = '식사 후 개운하게')
   or (p.name = '콜드브루 녹차' and t.name = '식사 후 개운하게')
   or (p.name = '스윗 히비스커스' and t.name = '디저트와 함께')
   or (p.name = '제주말차 밀크티' and t.name = '디저트와 함께')
   or (p.name = '멜로우 민트' and t.name = '피곤할 때')
   or (p.name = '피치 캐모마일' and t.name = '피곤할 때');
