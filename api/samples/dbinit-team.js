import logger from "../utils/logger.js";
import dotenv from "dotenv";

// 기본 .env 파일 로딩(package.json에서 로딩함)
// dotenv.config({ path: '.env' });
// 환경별 .env 파일 로딩
logger.log("NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV) {
  dotenv.config({ override: true, path: `.env.${process.env.NODE_ENV}` });
}

import db, { getClient, nextSeq } from "../utils/dbUtil.js";
import moment from "moment";

async function main() {
  await db.dropDatabase();
  logger.info("DB 삭제.");
  await initDB();
  return "DB 초기화 완료.";
}

main()
  .then(logger.info)
  .catch(logger.error)
  .finally(() => getClient().close());

async function initDB() {
  // 시퀀스 등록
  await registSeq();
  console.info("1. 시퀀스 등록 완료.");

  // 회원 등록
  await registUser();
  console.info("2. 회원 등록 완료.");

  // 상품 등록
  await registProduct();
  console.info("3. 상품 등록 완료.");

  // 장바구니 등록
  await registCart();
  console.info("4. 장바구니 등록 완료.");

  // 구매 등록
  await registOrder();
  console.info("5. 구매 등록 완료.");

  // 후기 등록
  await registReply();
  console.info("6. 후기 등록 완료.");

  // 코드 등록
  await registCode();
  console.info("7. 코드 등록 완료.");

  // 북마크 등록
  await registBookmark();
  console.info("8. 북마크 등록 완료.");

  // config
  await registConfig();
  console.info("9. config 등록 완료.");

  // 상품 조회
  await productList();
}

function getDay(day = 0) {
  return moment().add(day, "days").format("YYYY.MM.DD");
}
function getTime(day = 0, second = 0) {
  return moment()
    .add(day, "days")
    .add(second, "seconds")
    .format("YYYY.MM.DD HH:mm:ss");
}

// 시퀀스 등록
async function registSeq() {
  const seqList = ["user", "product", "cart", "order", "reply", "bookmark"];
  const data = seqList.map((_id) => ({ _id, no: 1 }));
  await db.seq.insertMany(data);
}

// 회원 등록
async function registUser() {
  var data = [
    {
      _id: await nextSeq("user"),
      email: "admin@market.com",
      password: "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
      name: "무지",
      phone: "01011112222",
      address: "서울시 강남구 역삼동 123",
      type: "admin",
      createdAt: getTime(-100, -60 * 60 * 3),
      updatedAt: getTime(-100, -60 * 60 * 3),
      extra: {
        birthday: "03-23",
        membershipClass: "MC03",
        addressBook: [
          {
            id: 1,
            name: "집",
            value: "서울시 강남구 역삼동 123",
          },
          {
            id: 2,
            name: "회사",
            value: "서울시 강남구 신사동 234",
          },
        ],
      },
    },
    {
      _id: await nextSeq("user"),
      email: "s1@market.com",
      password: "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
      name: "네오",
      phone: "01022223333",
      address: "서울시 강남구 삼성동 456",
      type: "seller",
      createdAt: getTime(-50),
      updatedAt: getTime(-30, -60 * 60 * 3),
      extra: {
        birthday: "11-23",
        membershipClass: "MC01",
        addressBook: [
          {
            id: 1,
            name: "회사",
            value: "서울시 강남구 삼성동 567",
          },
          {
            id: 2,
            name: "학교",
            value: "서울시 강남구 역삼동 234",
          },
        ],
      },
    },
    {
      _id: await nextSeq("user"),
      email: "s2@market.com",
      password: "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
      name: "어피치",
      phone: "01033334444",
      address: "서울시 강남구 도곡동 789",
      type: "seller",
      createdAt: getTime(-40, -60 * 30),
      updatedAt: getTime(-30, -60 * 20),
      extra: {
        confirm: false, // 관리자 승인이 안됨
        birthday: "11-24",
        membershipClass: "MC02",
        addressBook: [
          {
            id: 1,
            name: "회사",
            value: "서울시 마포구 연희동 123",
          },
          {
            id: 2,
            name: "가게",
            value: "서울시 강남구 학동 234",
          },
        ],
      },
    },
    {
      _id: await nextSeq("user"),
      email: "u1@market.com",
      password: "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
      name: "제이지",
      phone: "01044445555",
      address: "서울시 강남구 논현동 222",
      type: "user",
      createdAt: getTime(-20, -60 * 30),
      updatedAt: getTime(-10, -60 * 60 * 12),
      extra: {
        birthday: "11-30",
        membershipClass: "MC02",
        address: [
          {
            id: 1,
            name: "회사",
            value: "서울시 강동구 천호동 123",
          },
          {
            id: 2,
            name: "집",
            value: "서울시 강동구 성내동 234",
          },
        ],
      },
    },
  ];

  await db.user.insertMany(data);
}

// 상품 등록
async function registProduct() {
  const categories = [
    { code: "H0101", name: "tops" },
    { code: "H0102", name: "bottoms" },
    { code: "H0103", name: "shoes" },
    { code: "H0104", name: "backpacks" },
    { code: "H0105", name: "gear" },
    { code: "H0106", name: "set" },
  ];

  const imageUrls = [
    "https://m.bozeman.kr/web/product/medium/201609/9009_shop1_743979.jpg",
    "https://cdn-std-web-247-243.cdn-nhncommerce.com/vestakorea13_godomall_com/data/goods/19/12/52//1000000301/modify_main_033.jpg",
    "https://sitem.ssgcdn.com/34/01/42/item/1000171420134_i1_750.jpg",
    "https://media.bunjang.co.kr/product/241733146_11_1699097171_w360.jpg",
    "https://m.sosmall.co.kr/web/product/big/202308/08af169b329d98563e7ba9e142dda9ad.jpg",
    "https://img1.yna.co.kr/etc/inner/KR/2009/08/28/AKR20090828173800005_04_i_P2.jpg",
    "https://img0.yna.co.kr/etc/inner/KR/2009/08/28/AKR20090828173800005_01_i_P4.jpg",
    "https://san.chosun.com/news/photo/201210/7184_25832_3237.jpg",
    "https://img.allurekorea.com/allure/2011/10/style_56540c7592364.jpg",
    "https://qi-o.qoo10cdn.com/goods_image_big/9/6/0/2/989069602b_l.jpg",
    "https://contents.mediadecathlon.com/P2257910/sq/500X500/pic.jpg",
    "https://contents.mediadecathlon.com/P2257902/sq/500X500/pic.jpg",
    "https://prd-api-theres-resized.s3.ap-northeast-2.amazonaws.com/static/image/1684395911018/KPhW0BZPXbIUpMBAywGj/H_-dziP-NvIIlrkJNd_O_900.JPEG",
    "https://prd-api-theres-resized.s3.ap-northeast-2.amazonaws.com/static/image/1681008028497/CDpAdtEXzOWXpQXxN2KF/J7PfGgpGoHnh84UclKwT_900.JPEG",
    "https://m.outdoorbonbu.com/file_data/outdoorbonbumall/2018/11/13/93e1d818f9f37ecdcb18f03caa31492f.jpg",
    "https://static.coupangcdn.com/image/vendor_inventory/e986/22a634bc11b4f335d23d25bea8d3e83fc4566849e6d17afbe43911ea413e.jpg",
    "https://media.bunjang.co.kr/product/212660976_1_1686893566_w360.jpg",
  ];

  const contents = [
    "자연을 품은 중고 등산용품, 경제적인 모험을 시작하세요!",
    "품질 좋은 중고 등산 장비로 더 멀리, 더 높이!",
    "등산의 즐거움을 합리적인 가격으로, 중고 등산용품과 함께!",
    "환경을 생각하는 선택, 중고 등산용품으로 자연과 하나되기!",
    "내 취향에 맞는 중고 등산 장비, 여기 다 모였다!",
    "중고 등산용품, 믿을 수 있는 품질로 안전한 등산을!",
    "경제적으로 산을 즐기자, 품질 좋은 중고 등산용품!",
    "중고지만 믿을 수 있는, 나만의 등산 파트너!",
    "중고 등산용품으로 새로운 경험을, 더 넓은 세상을 만나세요!",
    "중고 등산 장비로 안전하고 즐거운 등산을 시작하세요!",
    "저렴한 가격, 높은 품질! 중고 등산용품의 매력에 빠져보세요!",
    "등산의 시작을 중고 장비와 함께, 가성비 최고!",
    "등산을 사랑하는 당신을 위한, 선택의 폭 넓은 중고 장비!",
    "등산의 기쁨을 저렴한 가격으로, 중고 장비가 답이다!",
    "더 높은 곳을 향해, 중고 등산 장비와 함께라면 가능해요!",
    "환경을 생각하는 소비, 중고 등산 장비로 시작해요!",
    "중고 등산용품, 가격 부담 없이 시작하는 등산의 첫걸음!",
    "중고지만 퀄리티는 최상, 등산 장비의 새로운 삶!",
    "가벼운 가격, 무거운 품질! 중고 등산용품의 이중 매력!",
    "중고 등산용품으로 산행의 진정한 즐거움을 느껴보세요!",
  ];

  const data = [];

  for (const category of categories) {
    for (let i = 1; i <= 10; i++) {
      let selectedImages = [];
      while (selectedImages.length < 3) {
        let randomImage =
          imageUrls[Math.floor(Math.random() * imageUrls.length)];
        if (!selectedImages.includes(randomImage)) {
          selectedImages.push(randomImage);
        }
      }

      let selectedContent = [];
      while (selectedContent.length < 3) {
        let randomContent =
          contents[Math.floor(Math.random() * contents.length)];
        if (!selectedContent.includes(randomContent)) {
          selectedContent.push(randomContent);
        }
      }

      data.push({
        _id: await nextSeq("product"),
        seller_id: Math.floor(Math.random() * 10) + 1,
        price: Math.floor(Math.random() * 291) * 1000 + 5000,
        shippingFees: Math.random() < 0.5 ? 0 : 3000,
        show: true,
        active: true,
        name: `${category.name} 제품 ${i}`,
        quantity: Math.floor(Math.random() * 100) + 1,
        buyQuantity: 0,
        mainImages: selectedImages,
        content: `
          <div class="product-detail">
            <p>상세 설명 
            ${selectedContent[0]}<br>
            ${selectedContent[1]}<br>

            </p>
          </div>`,
        createdAt: new Date(),
        updatedAt: new Date(),
        extra: {
          isNew: Math.random() < 0.5, // Randomly determine if the product is new or not
          isBest: Math.random() < 0.5, // Randomly determine if the product is a bestseller
          category: ["H01", category.code], // Use the provided category code
          sort: i,
        },
      });
    }
  }

  await db.product.insertMany(data);
}

// 장바구니 등록
async function registCart() {
  var data = [
    {
      _id: await nextSeq("cart"),
      user_id: 4,
      product_id: 1,
      quantity: 2,
      createdAt: getTime(-7, -60 * 30),
      updatedAt: getTime(-7, -60 * 30),
    },
    {
      _id: await nextSeq("cart"),
      user_id: 4,
      product_id: 2,
      quantity: 1,
      createdAt: getTime(-4, -60 * 30),
      updatedAt: getTime(-3, -60 * 60 * 12),
    },
    {
      _id: await nextSeq("cart"),
      user_id: 2,
      product_id: 3,
      quantity: 2,
      createdAt: getTime(-3, -60 * 60 * 4),
      updatedAt: getTime(-3, -60 * 60 * 4),
    },
    {
      _id: await nextSeq("cart"),
      user_id: 2,
      product_id: 4,
      quantity: 3,
      createdAt: getTime(-2, -60 * 60 * 12),
      updatedAt: getTime(-1, -60 * 60 * 20),
    },
  ];

  await db.cart.insertMany(data);
}

// 주문 등록
async function registOrder() {
  var data = [
    {
      _id: await nextSeq("order"),
      user_id: 4,
      products: [
        {
          _id: 2,
          seller_id: 2,
          state: "OS010",
          name: "헬로카봇 스톰다이버",
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/uploads/sample-diver.jpg`,
          quantity: 2,
          price: 34520,
          reply_id: 3,
        },
      ],
      cost: {
        products: 34520,
        shippingFees: 2500,
        discount: {
          products: 0,
          shippingFees: 0,
        },
        total: 37020,
      },
      address: {
        name: "회사",
        value: "서울시 강남구 신사동 234",
      },
      createdAt: getTime(-6, -60 * 60 * 3),
      updatedAt: getTime(-6, -60 * 60 * 3),
    },
    {
      _id: await nextSeq("order"),
      user_id: 4,
      products: [
        {
          _id: 3,
          seller_id: 2,
          state: "OS010",
          name: "레고 클래식 라지 조립 박스 10698",
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/uploads/sample-classic.jpg`,
          quantity: 1,
          price: 48870,
        },
        {
          _id: 4,
          seller_id: 3,
          state: "OS010",
          name: "레고 테크닉 42151 부가티 볼리드",
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/uploads/sample-bugatti.png`,
          quantity: 2,
          price: 90000,
          reply_id: 2,
        },
      ],
      cost: {
        products: 138840,
        shippingFees: 3500,
        discount: {
          products: 13880,
          shippingFees: 3500,
        },
        total: 124960,
      },
      address: {
        name: "집",
        value: "서울시 강남구 역삼동 123",
      },
      createdAt: getTime(-4, -60 * 60 * 22),
      updatedAt: getTime(-2, -60 * 60 * 12),
    },
    {
      _id: await nextSeq("order"),
      user_id: 4,
      products: [
        {
          _id: 4,
          seller_id: 3,
          state: "OS310",
          name: "레고 테크닉 42151 부가티 볼리드",
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/uploads/sample-bugatti.png`,
          quantity: 1,
          price: 45000,
          reply_id: 1,
        },
      ],
      cost: {
        products: 45000,
        shippingFees: 3500,
        discount: {
          products: 4500,
          shippingFees: 0,
        },
        total: 44000,
      },
      address: {
        name: "학교",
        value: "서울시 강남구 역삼동 234",
      },
      createdAt: getTime(-3, -60 * 60 * 18),
      updatedAt: getTime(-1, -60 * 60 * 1),
    },
    {
      _id: await nextSeq("order"),
      user_id: 2,
      products: [
        {
          _id: 2,
          seller_id: 2,
          state: "OS310",
          name: "헬로카봇 스톰다이버",
          image: `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/uploads/sample-diver.jpg`,
          quantity: 1,
          price: 17260,
          reply_id: 2,
          delivery: {
            company: "한진 택배",
            trackingNumber: "364495958003",
            url: "https://trace.cjlogistics.com/next/tracking.html?wblNo=364495958003",
          },
        },
      ],
      cost: {
        products: 17260,
        shippingFees: 2500,
        discount: {
          products: 0,
          shippingFees: 0,
        },
        total: 19760,
      },
      address: {
        name: "학교",
        value: "서울시 강남구 역삼동 234",
      },
      createdAt: getTime(-3, -60 * 60 * 18),
      updatedAt: getTime(-1, -60 * 60 * 1),
    },
  ];

  await db.order.insertMany(data);
}

// 후기 등록
async function registReply() {
  var data = [
    {
      _id: await nextSeq("reply"),
      user_id: 4,
      order_id: 1,
      product_id: 2,
      rating: 5,
      content: "아이가 좋아해요.",
      createdAt: getTime(-4, -60 * 60 * 12),
    },
    {
      _id: await nextSeq("reply"),
      user_id: 2,
      order_id: 4,
      product_id: 2,
      rating: 4,
      content: "배송이 좀 느려요.",
      createdAt: getTime(-3, -60 * 60 * 1),
    },
    {
      _id: await nextSeq("reply"),
      user_id: 4,
      order_id: 2,
      product_id: 3,
      rating: 1,
      content: "하루만에 고장났어요.",
      extra: {
        title: "추천하지 않습니다.",
      },
      createdAt: getTime(-2, -60 * 60 * 10),
    },
  ];

  await db.reply.insertMany(data);
}

// 코드 등록
async function registCode() {
  var data = [
    {
      _id: "productCategory",
      title: "상품 카테고리",
      codes: [
        {
          sort: 2,
          code: "PC01",
          value: "어린이",
          depth: 1,
        },
        {
          sort: 3,
          code: "PC0101",
          value: "퍼즐",
          parent: "PC01",
          depth: 2,
        },
        {
          sort: 1,
          code: "PC0102",
          value: "보드게임",
          parent: "PC01",
          depth: 2,
        },
        {
          sort: 2,
          code: "PC010201",
          value: "2인용",
          parent: "PC0102",
          depth: 3,
        },
        {
          sort: 1,
          code: "PC010202",
          value: "3~4인용",
          parent: "PC0102",
          depth: 3,
        },
        {
          sort: 2,
          code: "PC0103",
          value: "레고",
          parent: "PC01",
          depth: 2,
        },
        {
          sort: 4,
          code: "PC0104",
          value: "로봇",
          parent: "PC01",
          depth: 2,
        },

        {
          sort: 1,
          code: "PC02",
          value: "스포츠",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC0201",
          value: "축구",
          parent: "PC02",
          depth: 2,
        },
        {
          sort: 3,
          code: "PC0202",
          value: "야구",
          parent: "PC02",
          depth: 2,
        },
        {
          sort: 2,
          code: "PC0203",
          value: "농구",
          parent: "PC02",
          depth: 2,
        },

        {
          sort: 3,
          code: "PC03",
          value: "어른",
          depth: 1,
        },
        {
          sort: 1,
          code: "PC0301",
          value: "원격 조종",
          parent: "PC03",
          depth: 2,
        },
        {
          sort: 2,
          code: "PC0302",
          value: "퍼즐",
          parent: "PC03",
          depth: 2,
        },
        {
          sort: 3,
          code: "PC0303",
          value: "레고",
          parent: "PC03",
          depth: 2,
        },
      ],
    },
    {
      _id: "orderState",
      title: "주문 상태",
      codes: [
        {
          sort: 1,
          code: "OS010",
          value: "주문 완료",
        },
        {
          sort: 2,
          code: "OS020",
          value: "결제 완료",
        },
        {
          sort: 3,
          code: "OS030",
          value: "배송 준비중",
        },
        {
          sort: 4,
          code: "OS035",
          value: "배송중",
        },
        {
          sort: 5,
          code: "OS040",
          value: "배송 완료",
        },
        {
          sort: 6,
          code: "OS110",
          value: "반품 요청",
        },
        {
          sort: 7,
          code: "OS120",
          value: "반품 처리중",
        },
        {
          sort: 8,
          code: "OS130",
          value: "반품 완료",
        },
        {
          sort: 9,
          code: "OS210",
          value: "교환 요청",
        },
        {
          sort: 10,
          code: "OS220",
          value: "교환 처리중",
        },
        {
          sort: 11,
          code: "OS230",
          value: "교환 완료",
        },
        {
          sort: 12,
          code: "OS310",
          value: "환불 요청",
        },
        {
          sort: 13,
          code: "OS320",
          value: "환불 처리중",
        },
        {
          sort: 14,
          code: "OS330",
          value: "환불 완료",
        },
      ],
    },
    {
      _id: "membershipClass",
      title: "회원 등급",
      codes: [
        {
          sort: 1,
          code: "MC01",
          value: "일반",
          discountRate: 0, // 할인율
        },
        {
          sort: 2,
          code: "MC02",
          value: "프리미엄",
          discountRate: 10,
        },
        {
          sort: 3,
          code: "MC03",
          value: "VIP",
          discountRate: 20,
        },
      ],
    },
  ];
  await db.code.insertMany(data);
}

// 북마크 등록
async function registBookmark() {
  var data = [
    {
      _id: await nextSeq("bookmark"),
      user_id: 4,
      product_id: 2,
      memo: "첫째 크리스마스 선물.",
      createdAt: getTime(-3, -60 * 60 * 2),
    },
    {
      _id: await nextSeq("bookmark"),
      user_id: 4,
      product_id: 3,
      memo: "둘째 입학 선물",
      createdAt: getTime(-2, -60 * 60 * 20),
    },
    {
      _id: await nextSeq("bookmark"),
      user_id: 4,
      product_id: 4,
      memo: "이달 보너스타면 꼭!!!",
      createdAt: getTime(-1, -60 * 60 * 12),
    },
    {
      _id: await nextSeq("bookmark"),
      user_id: 2,
      product_id: 4,
      memo: "1순위로 살것!",
      createdAt: getTime(-1, -60 * 60 * 12),
    },
  ];

  await db.bookmark.insertMany(data);
}

// config 등록
async function registConfig() {
  var data = [
    {
      _id: "shippingFees",
      title: "배송비",
      value: 3500,
    },
    {
      _id: "freeShippingFees",
      title: "배송비 무료 금액",
      value: 50000,
    },
  ];
  await db.config.insertMany(data);
}

// 모든 상품명을 출력한다.
async function productList() {
  var result = await db.product
    .find({}, { projection: { _id: 0, name: 1 } })
    .toArray();
  logger.log(`상품 ${result.length}건 조회됨.`);
  logger.log(result);
}
