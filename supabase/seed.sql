-- 필터용 태그 (맛과 향 / 원물 / 상황)
insert into public.tags (category, name) values
  ('flavor_aroma', '너티'),
  ('flavor_aroma', '시트러스'),
  ('flavor_aroma', '프루티'),
  ('flavor_aroma', '플로럴'),
  ('flavor_aroma', '허벌'),
  ('raw_material', '귤'),
  ('raw_material', '귤꽃'),
  ('raw_material', '깔라만시'),
  ('raw_material', '꿀'),
  ('raw_material', '동백꽃'),
  ('raw_material', '딸기'),
  ('raw_material', '라벤더'),
  ('raw_material', '레몬'),
  ('raw_material', '리치'),
  ('raw_material', '망고'),
  ('raw_material', '머스캣'),
  ('raw_material', '무화과'),
  ('raw_material', '민트'),
  ('raw_material', '바닐라'),
  ('raw_material', '바질'),
  ('raw_material', '밤'),
  ('raw_material', '배'),
  ('raw_material', '벚꽃'),
  ('raw_material', '베르가못'),
  ('raw_material', '복숭아'),
  ('raw_material', '사과'),
  ('raw_material', '살구'),
  ('raw_material', '영귤'),
  ('raw_material', '오렌지'),
  ('raw_material', '유자'),
  ('raw_material', '장미'),
  ('raw_material', '체리'),
  ('raw_material', '초콜릿'),
  ('raw_material', '캐모마일'),
  ('raw_material', '크랜베리'),
  ('raw_material', '파인애플'),
  ('raw_material', '파파야'),
  ('raw_material', '히비스커스'),
  ('situation', '늦은 오후 차분하게'),
  ('situation', '디저트와 함께'),
  ('situation', '식사 후 개운하게'),
  ('situation', '아침을 깨워주는'),
  ('situation', '운동 후 상쾌하게'),
  ('situation', '피곤할 때');

-- 전체 상품 (2026-10-11 기준, 실제 osulloc.com 데이터로 정리됨)
insert into public.products (name, description, heritage_copy, price, base, format, is_caffeine_free, is_organic) values
  ('가루녹차', '우유에 타 먹는 가루 녹차', '제주 다원의 찻잎을 곱게 갈았어요', 11000, '녹차/말차/호지차', '가루차', false, true),
  ('귤꽃향 블라썸 티', null, null, 11000, '홍차/발효차', '종이티백', false, false),
  ('귤꽃향을 품은 우잣담 10입', null, null, 16500, '홍차/발효차', '피라미드티백', false, false),
  ('귤꽃향을 품은 우잣담 20입', null, null, 27000, '홍차/발효차', '피라미드티백', false, false),
  ('달빛 걷기 35g', null, null, 15000, '홍차/발효차', '잎차', false, false),
  ('달빛 꿀배 콜드브루 티', null, null, 14000, '홍차/발효차', '찬물스틱티백', false, false),
  ('달빛걷기 10입', null, null, 16500, '홍차/발효차', '피라미드티백', false, false),
  ('달빛걷기 3입', null, null, 5500, '홍차/발효차', '피라미드티백', false, false),
  ('동백이 피는 곶자왈 10입', null, null, 16500, '홍차/발효차', '피라미드티백', false, false),
  ('동백이 피는 곶자왈 3입', null, null, 5500, '홍차/발효차', '피라미드티백', false, false),
  ('루이보스 문라이트 10입', '은은한 과일향 루이보스', '제주의 밤하늘을 닮은 부드러운 블렌드예요', 16500, '허브', '피라미드티백', true, false),
  ('루이보스 문라이트 3입', null, null, 5500, '허브', '피라미드티백', true, false),
  ('루이보스 체리벨벳 10입', null, null, 16500, '허브', '피라미드티백', true, false),
  ('루이보스 퓨어 10입', null, null, 16500, '허브', '피라미드티백', true, false),
  ('마롱 글라세 블랙티', null, null, 11000, '홍차/발효차', '종이티백', false, false),
  ('마롱 크림 블랙티 10입', null, null, 16500, '홍차/발효차', '피라미드티백', false, false),
  ('마롱 크림 블랙티 20입', null, null, 27000, '홍차/발효차', '피라미드티백', false, false),
  ('마스터즈 말차', '더 진하고 깊은 말차 애호가용', '제주 차밭의 햇볕을 가장 오래 머금은 잎으로 만들었어요', 50000, '녹차/말차/호지차', '가루차', false, false),
  ('말차 콜드브루 티', null, null, 14000, '녹차/말차/호지차', '찬물스틱티백', false, false),
  ('말차플러스 콜라겐', null, null, 12000, '녹차/말차/호지차', '가루차', false, false),
  ('말차플러스 테아닌', null, null, 12000, '녹차/말차/호지차', '가루차', false, false),
  ('말차플러스 프로바이오틱스', null, null, 12000, '녹차/말차/호지차', '가루차', false, false),
  ('멜로우 민트', '부드러운 민트향 허브티', '편안하고 부드러운 민트 블렌드예요', 12000, '허브', '종이티백', true, false),
  ('무화과 쇼콜라 블랙티', null, null, 11000, '홍차/발효차', '종이티백', false, false),
  ('무화과 애플 블랙티 10입', null, null, 16500, '홍차/발효차', '피라미드티백', false, false),
  ('무화과 애플 블랙티 20입', null, null, 27000, '홍차/발효차', '피라미드티백', false, false),
  ('밀키 우롱티 10입', null, null, 16500, '홍차/발효차', '피라미드티백', false, false),
  ('바닐라 허니 블랙티', null, null, 11000, '홍차/발효차', '종이티백', false, false),
  ('바질 보타닉 가든 10입', null, null, 16500, '허브', '피라미드티백', true, false),
  ('벚꽃향 가득한 올레 3입', null, null, 5500, '홍차/발효차', '피라미드티백', false, false),
  ('베리 바닐라 그린티', null, null, 11000, '녹차/말차/호지차', '종이티백', false, false),
  ('삼다꿀배티', null, null, 11000, '홍차/발효차', '종이티백', false, false),
  ('삼다연 80g', null, null, 15000, '홍차/발효차', '잎차', false, false),
  ('삼다연 오리지널 밀크티', '오설록 대표 밀크티', '제주의 차향을 가장 편하게 담은 밀크티예요', 9500, '홍차/발효차', '가루차', false, false),
  ('삼다연 제주영귤 30g', null, null, 15000, '홍차/발효차', '잎차', false, false),
  ('삼다연 제주영귤 3입', null, null, 5500, '홍차/발효차', '피라미드티백', false, false),
  ('선샤인 머스캣 콜드브루 티', null, null, 14000, '녹차/말차/호지차', '찬물스틱티백', false, false),
  ('선셋피치 콜드브루 티', null, null, 14000, '홍차/발효차', '찬물스틱티백', false, false),
  ('세작 10입', null, null, 16500, '녹차/말차/호지차', '피라미드티백', false, false),
  ('세작 20입', null, null, 27000, '녹차/말차/호지차', '피라미드티백', false, false),
  ('세작 40g', null, null, 17000, '녹차/말차/호지차', '잎차', false, false),
  ('세작 80g', null, null, 15000, '녹차/말차/호지차', '잎차', false, false),
  ('스윗 허니 블랙티', null, null, 11000, '홍차/발효차', '종이티백', false, false),
  ('스윗 히비스커스', '달콤한 과일향 허브티', '새콤달콤한 히비스커스 본연의 매력이에요', 12500, '허브', '종이티백', true, false),
  ('스윗 히비스커스 콜드브루 티', null, null, 14000, '허브', '찬물스틱티백', true, false),
  ('시그니처 얼그레이 10입', null, null, 16500, '홍차/발효차', '피라미드티백', false, false),
  ('시그니처 얼그레이 20입', null, null, 27000, '홍차/발효차', '피라미드티백', false, false),
  ('얼그레이 밀크티', '홍차 향 가득한 밀크티', '제주산 홍차의 깊은 향을 우유와 함께 즐겨보세요', 9000, '홍차/발효차', '찬물스틱티백', false, false),
  ('우전 60g', null, null, 70000, '녹차/말차/호지차', '잎차', false, false),
  ('월출향 60g', null, null, 15000, '홍차/발효차', '잎차', false, false),
  ('웨딩그린티 20입', null, null, 27000, '녹차/말차/호지차', '피라미드티백', false, false),
  ('유자 얼그레이', null, null, 11000, '홍차/발효차', '종이티백', false, false),
  ('일로향 60g', null, null, 170000, '녹차/말차/호지차', '잎차', false, false),
  ('제주 동백꽃 티', null, null, 11000, '홍차/발효차', '종이티백', false, false),
  ('제주 말차 밀크티', '진한 말차와 부드러운 우유의 조화', '제주 다원의 말차를 우유에 듬뿍 녹였어요', 13000, '녹차/말차/호지차', '가루차', false, false),
  ('제주 말차 오트 블렌드', '오트밀크와 어우러진 말차', '제주 말차에 고소한 오트밀크를 더했어요', 9500, '녹차/말차/호지차', '가루차', false, false),
  ('제주 말차샷 블렌드', null, null, 13000, '녹차/말차/호지차', '가루차', false, false),
  ('제주 삼다 영귤티', null, null, 11000, '홍차/발효차', '종이티백', false, false),
  ('제주 순수 녹차', null, null, 11000, '녹차/말차/호지차', '종이티백', false, false),
  ('제주 호지샷 블렌드', null, null, 13000, '녹차/말차/호지차', '가루차', false, false),
  ('제주 호지차', null, null, 11000, '녹차/말차/호지차', '종이티백', false, false),
  ('제주 호지차 밀크티', '구수한 호지차 밀크티', '제주에서 볶아낸 호지차를 우유와 함께 담았어요', 13000, '녹차/말차/호지차', '가루차', false, false),
  ('제주 화산우롱차', null, null, 11000, '홍차/발효차', '종이티백', false, false),
  ('제주숲홍차 10입', null, null, 16500, '홍차/발효차', '피라미드티백', false, false),
  ('제주화산암차 10입', null, null, 16500, '홍차/발효차', '피라미드티백', false, false),
  ('제주화산암차 20입', null, null, 27000, '홍차/발효차', '피라미드티백', false, false),
  ('찬물 녹차', null, null, 9500, '녹차/말차/호지차', '찬물스틱티백', false, false),
  ('찬물 루이보스티', '찬물에 바로 즐기는 루이보스', '언제 어디서든 편안하게 즐겨보세요', 11000, '허브', '찬물스틱티백', true, true),
  ('찬물루이보스티', null, null, 9500, '허브', '찬물스틱티백', true, false),
  ('청우롱 10입', null, null, 16500, '홍차/발효차', '피라미드티백', false, false),
  ('청우롱 50g', null, null, 15000, '홍차/발효차', '잎차', false, false),
  ('캐모마일 라벤더', '플로럴한 허브 본연의 향', '편안한 라벤더와 캐모마일의 조화예요', 12500, '허브', '종이티백', true, false),
  ('캐모마일 로지피치 10입', null, null, 16500, '허브', '피라미드티백', true, false),
  ('캐모마일 블렌드 10입', null, null, 16500, '허브', '피라미드티백', true, false),
  ('캐모마일 블렌드 3입', null, null, 5500, '허브', '피라미드티백', true, false),
  ('콤부차 애플파인', null, null, 8000, '허브', '가루차', false, false),
  ('프리미엄 말차', '고소하고 진한 말차 본연의 맛', '제주 다원에서 자란 찻잎을 그대로 갈아만든 순수 말차예요', 28000, '녹차/말차/호지차', '가루차', false, true),
  ('피차 파파야 블랙티 10입', null, null, 16500, '홍차/발효차', '피라미드티백', false, false),
  ('피차 파파야 블랙티 3입', null, null, 5500, '홍차/발효차', '피라미드티백', false, false),
  ('피치 캐모마일', '은은한 복숭아향 허브티', '편안한 캐모마일에 달콤한 복숭아향을 더했어요', 12500, '허브', '종이티백', true, false),
  ('허니 살구향 그린티', null, null, 11000, '녹차/말차/호지차', '종이티백', false, false),
  ('홍우전 60g', null, null, 15000, '홍차/발효차', '잎차', false, false),
  ('히비스커스 선샤인 10입', null, null, 16500, '허브', '피라미드티백', true, false);

-- 상품-태그 연결
insert into public.product_tags (product_id, tag_id)
select p.id, t.id from public.products p, public.tags t
where
  (p.name = '캐모마일 라벤더' and t.name = '플로럴')
   or   (p.name = '프리미엄 말차' and t.name = '너티')
   or   (p.name = '피치 캐모마일' and t.name = '프루티')
   or   (p.name = '스윗 히비스커스' and t.name = '프루티')
   or   (p.name = '루이보스 문라이트 10입' and t.name = '프루티')
   or   (p.name = '멜로우 민트' and t.name = '허벌')
   or   (p.name = '피치 캐모마일' and t.name = '복숭아')
   or   (p.name = '피치 캐모마일' and t.name = '캐모마일')
   or   (p.name = '캐모마일 라벤더' and t.name = '캐모마일')
   or   (p.name = '스윗 히비스커스' and t.name = '히비스커스')
   or   (p.name = '멜로우 민트' and t.name = '민트')
   or   (p.name = '프리미엄 말차' and t.name = '아침을 깨워주는')
   or   (p.name = '제주 말차 밀크티' and t.name = '디저트와 함께')
   or   (p.name = '스윗 히비스커스' and t.name = '디저트와 함께')
   or   (p.name = '피치 캐모마일' and t.name = '피곤할 때')
   or   (p.name = '멜로우 민트' and t.name = '피곤할 때')
   or   (p.name = '삼다꿀배티' and t.name = '배')
   or   (p.name = '삼다꿀배티' and t.name = '꿀')
   or   (p.name = '제주 삼다 영귤티' and t.name = '영귤')
   or   (p.name = '마롱 글라세 블랙티' and t.name = '밤')
   or   (p.name = '마롱 글라세 블랙티' and t.name = '초콜릿')
   or   (p.name = '마롱 크림 블랙티 10입' and t.name = '밤')
   or   (p.name = '제주 동백꽃 티' and t.name = '동백꽃')
   or   (p.name = '유자 얼그레이' and t.name = '유자')
   or   (p.name = '캐모마일 블렌드 10입' and t.name = '캐모마일')
   or   (p.name = '캐모마일 블렌드 10입' and t.name = '사과')
   or   (p.name = '달빛 걷기 35g' and t.name = '배')
   or   (p.name = '귤꽃향을 품은 우잣담 10입' and t.name = '귤꽃')
   or   (p.name = '귤꽃향을 품은 우잣담 10입' and t.name = '귤')
   or   (p.name = '베리 바닐라 그린티' and t.name = '딸기')
   or   (p.name = '베리 바닐라 그린티' and t.name = '바닐라')
   or   (p.name = '스윗 히비스커스 콜드브루 티' and t.name = '히비스커스')
   or   (p.name = '캐모마일 로지피치 10입' and t.name = '캐모마일')
   or   (p.name = '캐모마일 로지피치 10입' and t.name = '장미')
   or   (p.name = '캐모마일 로지피치 10입' and t.name = '복숭아')
   or   (p.name = '귤꽃향 블라썸 티' and t.name = '귤꽃')
   or   (p.name = '히비스커스 선샤인 10입' and t.name = '히비스커스')
   or   (p.name = '삼다연 제주영귤 30g' and t.name = '영귤')
   or   (p.name = '달빛 꿀배 콜드브루 티' and t.name = '배')
   or   (p.name = '바닐라 허니 블랙티' and t.name = '꿀')
   or   (p.name = '바닐라 허니 블랙티' and t.name = '바닐라')
   or   (p.name = '달빛걷기 3입' and t.name = '배')
   or   (p.name = '피차 파파야 블랙티 10입' and t.name = '복숭아')
   or   (p.name = '피차 파파야 블랙티 10입' and t.name = '파파야')
   or   (p.name = '허니 살구향 그린티' and t.name = '꿀')
   or   (p.name = '허니 살구향 그린티' and t.name = '살구')
   or   (p.name = '달빛걷기 10입' and t.name = '배')
   or   (p.name = '벚꽃향 가득한 올레 3입' and t.name = '벚꽃')
   or   (p.name = '벚꽃향 가득한 올레 3입' and t.name = '체리')
   or   (p.name = '바질 보타닉 가든 10입' and t.name = '바질')
   or   (p.name = '무화과 애플 블랙티 10입' and t.name = '무화과')
   or   (p.name = '무화과 애플 블랙티 10입' and t.name = '사과')
   or   (p.name = '무화과 애플 블랙티 20입' and t.name = '무화과')
   or   (p.name = '무화과 애플 블랙티 20입' and t.name = '사과')
   or   (p.name = '무화과 쇼콜라 블랙티' and t.name = '무화과')
   or   (p.name = '무화과 쇼콜라 블랙티' and t.name = '초콜릿')
   or   (p.name = '마롱 크림 블랙티 20입' and t.name = '밤')
   or   (p.name = '캐모마일 블렌드 3입' and t.name = '캐모마일')
   or   (p.name = '캐모마일 블렌드 3입' and t.name = '사과')
   or   (p.name = '귤꽃향을 품은 우잣담 20입' and t.name = '귤꽃')
   or   (p.name = '귤꽃향을 품은 우잣담 20입' and t.name = '귤')
   or   (p.name = '동백이 피는 곶자왈 3입' and t.name = '동백꽃')
   or   (p.name = '동백이 피는 곶자왈 10입' and t.name = '동백꽃')
   or   (p.name = '피차 파파야 블랙티 3입' and t.name = '복숭아')
   or   (p.name = '피차 파파야 블랙티 3입' and t.name = '파파야')
   or   (p.name = '삼다연 제주영귤 3입' and t.name = '영귤')
   or   (p.name = '루이보스 체리벨벳 10입' and t.name = '체리')
   or   (p.name = '루이보스 문라이트 3입' and t.name = '배')
   or   (p.name = '스윗 허니 블랙티' and t.name = '꿀')
   or   (p.name = '시그니처 얼그레이 10입' and t.name = '유자')
   or   (p.name = '시그니처 얼그레이 10입' and t.name = '베르가못')
   or   (p.name = '웨딩그린티 20입' and t.name = '머스캣')
   or   (p.name = '말차플러스 프로바이오틱스' and t.name = '사과')
   or   (p.name = '말차플러스 프로바이오틱스' and t.name = '크랜베리')
   or   (p.name = '말차플러스 테아닌' and t.name = '오렌지')
   or   (p.name = '말차플러스 테아닌' and t.name = '레몬')
   or   (p.name = '말차플러스 콜라겐' and t.name = '딸기')
   or   (p.name = '말차플러스 콜라겐' and t.name = '복숭아')
   or   (p.name = '선샤인 머스캣 콜드브루 티' and t.name = '머스캣')
   or   (p.name = '선셋피치 콜드브루 티' and t.name = '복숭아')
   or   (p.name = '콤부차 애플파인' and t.name = '사과')
   or   (p.name = '콤부차 애플파인' and t.name = '파인애플')
   or   (p.name = '시그니처 얼그레이 20입' and t.name = '유자')
   or   (p.name = '시그니처 얼그레이 20입' and t.name = '베르가못')
   or   (p.name = '웨딩그린티 20입' and t.name = '프루티')
   or   (p.name = '허니 살구향 그린티' and t.name = '프루티')
   or   (p.name = '귤꽃향 블라썸 티' and t.name = '플로럴')
   or   (p.name = '귤꽃향을 품은 우잣담 10입' and t.name = '플로럴')
   or   (p.name = '귤꽃향을 품은 우잣담 20입' and t.name = '플로럴')
   or   (p.name = '베리 바닐라 그린티' and t.name = '프루티')
   or   (p.name = '선샤인 머스캣 콜드브루 티' and t.name = '프루티')
   or   (p.name = '말차플러스 콜라겐' and t.name = '프루티')
   or   (p.name = '말차플러스 테아닌' and t.name = '시트러스')
   or   (p.name = '말차플러스 프로바이오틱스' and t.name = '프루티')
   or   (p.name = '달빛 걷기 35g' and t.name = '프루티')
   or   (p.name = '달빛 꿀배 콜드브루 티' and t.name = '프루티')
   or   (p.name = '달빛걷기 10입' and t.name = '프루티')
   or   (p.name = '달빛걷기 3입' and t.name = '프루티')
   or   (p.name = '무화과 쇼콜라 블랙티' and t.name = '프루티')
   or   (p.name = '무화과 애플 블랙티 10입' and t.name = '프루티')
   or   (p.name = '무화과 애플 블랙티 20입' and t.name = '프루티')
   or   (p.name = '삼다꿀배티' and t.name = '프루티')
   or   (p.name = '선셋피치 콜드브루 티' and t.name = '프루티')
   or   (p.name = '피차 파파야 블랙티 10입' and t.name = '프루티')
   or   (p.name = '피차 파파야 블랙티 3입' and t.name = '프루티')
   or   (p.name = '동백이 피는 곶자왈 10입' and t.name = '플로럴')
   or   (p.name = '동백이 피는 곶자왈 3입' and t.name = '플로럴')
   or   (p.name = '벚꽃향 가득한 올레 3입' and t.name = '플로럴')
   or   (p.name = '제주 동백꽃 티' and t.name = '플로럴')
   or   (p.name = '삼다연 제주영귤 30g' and t.name = '시트러스')
   or   (p.name = '삼다연 제주영귤 3입' and t.name = '시트러스')
   or   (p.name = '시그니처 얼그레이 10입' and t.name = '시트러스')
   or   (p.name = '시그니처 얼그레이 20입' and t.name = '시트러스')
   or   (p.name = '유자 얼그레이' and t.name = '시트러스')
   or   (p.name = '제주 삼다 영귤티' and t.name = '시트러스')
   or   (p.name = '마롱 글라세 블랙티' and t.name = '너티')
   or   (p.name = '마롱 크림 블랙티 10입' and t.name = '너티')
   or   (p.name = '마롱 크림 블랙티 20입' and t.name = '너티')
   or   (p.name = '밀키 우롱티 10입' and t.name = '너티')
   or   (p.name = '바닐라 허니 블랙티' and t.name = '허벌')
   or   (p.name = '스윗 허니 블랙티' and t.name = '허벌');
