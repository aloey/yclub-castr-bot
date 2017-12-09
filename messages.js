const constants = require('./constants');

module.exports = {
    greeting: {
        kr: '안녕하세요. 캐스터입니다. 현재 저희는 채팅을 통해 "질의응답", "블로그",  "카드뉴스", "고객상담서비스", 및 "리포트" 서비스를 제공하고 있습니다. 원하시는 서비스를 선택해주세요! 감사합니다.',
    },
    faq: {
        kr: '질의응답 게시판에 오신 것을 환영합니다. 궁금하신 내용을 말씀해주시거나 보기의 목록에서 선택해주시기 바랍니다.',
    },
    faqCont: {
        kr: '다른 질문은 더 없으신가요?',
    },
    info: {
        kr: '원하시는 정보를 선택해주시기 바랍니다.',
    },
    subInfo: {
        [constants.informations.trend]: {
            kr: '캐스터 뉴스룸에 오신것을 환영합니다. 궁금하신 주제를 선택해주세요.',
        },
        [constants.informations.manual]: {
            kr: '더욱 효율적인 광고를 위해 궁금하신 활용법을 선택해 주시기 바랍니다.',
        },
        [constants.informations.service]: {
            kr: '캐스터에 관한 궁금하신 사항을 선택해주시기 바랍니다.',
        },
    },
    support: {
        kr: '현재 저희는 세가지 방법으로 고객님의 궁금증을 풀어드리고 있습니다. 첫번째는, 카톡 (ID name) 이나 페이스북 (link address)으로 메세지를 보내주시는 것 입니다. 두번째는, 이메일 (contact@castr.ai) 입니다. 세번째는, 전화 미팅 서비스입니다.',
    },
    supportDate: {
        kr: '전화미팅 서비스를 계속하시려면 밑에 가능시간 중에 하나를 선택해주세요.',
    },
    customDate: {
        kr: '원하시는 날짜를 입력해주시기 바랍니다. 예) 1995/07/24 또는 1995년 7월 24일',
    },
    nonAvailable: {
        kr: '입력하신 날짜에 가능한 시간이 없습니다.',
    },
    privPolicyWarn: {
        kr: '제공되는 개인정보수집관련 정보를 읽어주시기 바랍니다. *저희는 고객님의 소중한 정보를 절대 유출 및 남용하지 않습니다.',
    },
    privPolicyText: {
        kr: '### 개인정보 수집∙이용 동의서\n'
            + '\n---\n'
            + '#### 1. 개인정보의 수집∙이용 목적\n'
            + '주)엘에이치엔터테인먼트의 프로덕트 캐스터의 원활한 고객 응대 서비스 업무에 필요한 개인정보를 수집하고 이용하고자 함\n'
            + '\n---\n'
            + '#### 2. 수집하려는 개인정보의 항목\n'
            + '* 일반정보 – 성명, 연락처 [휴대폰 번호, 회사 번호 등]\n'
            + '* 통신정보 – 전자우편\n'
            + '\n---\n'
            + '#### 3. 개인정보의 보유 및 이용기간\n'
            + '동의일로부터 고객응대서비스 완료 시까지 보유 후 파기\n'
            + '\n---\n'
            + '#### 4. 동의 거부권 및 거부 시 불이익 고지\n'
            + '귀하는 개인정보 수집∙이용에 관한 동의를 거부할 수 있습니다. 다만, 고객 응대 서비스 활용이 불가능할 수 있습니다.\n'
            + '\n---\n'
            + '「개인정보보호법」, 「동법 시행령」, 「동법 시행규칙」에 의거하여 본인의 개인정보를 위와 같이 수집∙이용하도록 하는데 동의 합니다.',
    },
    privInfoNotAllowed: {
        kr: '개인정보 보호법에 동의를 안 하실경우 저희가 연락정보 유치가 법적으로 불가능 합니다. 불편하시겠지만, 이메일이나 채팅으로 문의 부탁드립니다.',
    },
    namePhone: {
        kr: '성명과 연락가능하신 전화번호를 입력해주시기 바랍니다. 예) 뽀로리 010-5228-3023',
    },
    question: {
        kr: name => `감사합니다 **${name}** 님. 보다 원활한 진행을 위하여 가능하시다면 궁금하신 사항을 적어주시기 바랍니다.\n\n예1) 캐스터의 부가서비스 사용에 대해 문의드리려 합니다.\n\n예2) 광고대행사 입니다. 사용 비용 및 사용 방법에 대해 문의드리려합니다.`,
    },
    supportSuccess: {
        kr: support => `잘 받았습니다 **${support.name}** 님. 캐스터 고객관리 팀에서 **${support.selectedDate.display}** **${support.selectedTime.display}** 에 *__${support.phoneNumber}__* 로 연락드리도록 하겠습니다. 곧 찾아뵙겠습니다. 관심가져주셔서 감사합니다. 좋은 하루 보내세요.`,
    },
    report: {
        kr: '어카운트 고유 ID를 입력해주시기 바랍니다.',
    },
    return: {
        kr: '메인메뉴로 돌아가시려면 "메인메뉴" 라고 말해주세요!',
    },
    badFormat: {
        kr: '포맷에 맞게 입력해주세요 ㅠㅠ',
    },
    badDate: {
        kr: '2개월 안으로 예약을 잡아주세요 ㅠㅠ',
    },
    reportFields: {
        kr: {
            '프로모션 이름': () => '\n\n', // 프로모션 이름:      “xxxxx” 
            '프로모션 집행비 (사용량)': report => `${report.amountSpent} ${report.currency}\n\n`,
            '프로모션 기간': report => `${report.dateStart}-${report.dateEnd}\n\n`,
            '프로모션 장소': () => '\n\n', // 프로모션 장소: xxxx,xxxx,xxxx,xxxx
            '목표 설정': () => '\n\n', // 목표 설정: 도달 (날짜 or 금액)  클릭 (날짜 or 금액) 구매 (날짜 or 금액) 
            '집행비 분배': (report) => {
                const currency = report.currency;
                const facebook = [
                    report.budget.facebook,
                    (report.budget.facebook / report.amountSpent).toFixed(2)
                ];
                const instagram = [
                    report.budget.instagram,
                    (report.budget.instagram / report.amountSpent).toFixed(2)
                ];
                const audienceNetwork = [
                    report.budget.audienceNetwork,
                    (report.budget.audienceNetwork / report.amountSpent).toFixed(2)
                ];
                return `${constants.platform.kr.facebook} ${facebook[0]} ${currency} (${facebook[1]}%), ${constants.platform.kr.instagram} ${instagram[0]} (${instagram[1]}%), ${constants.platform.kr.audienceNetwork} ${audienceNetwork[0]} (${audienceNetwork[1]}%)\n\n`;
            },
            '총 노출 수': report => `${report.impressions.total} (1000개당: ${report.impressions.unitCost} ${report.currency})\n\n`,
            '총 도달 수': report => `${report.reach.total} (1000개당: ${report.reach.unitCost} ${report.currency})\n\n`,
            '총 링크클릭 수': report => `${report.linkClicks.total} (1개당: ${report.linkClicks.unitCost} ${report.currency}; 확률: ${report.linkClicks.rate}%)\n\n`,
            '총 반응 수': (report) => {
                let responses = `${report.responses.total} (`;
                responses += `결제수단 입력: ${report.responses.addPaymentInfo}, `;
                responses += `장바구니에 담기: ${report.responses.addToCart}, `;
                responses += `찜하기: ${report.responses.addToWishlist}, `;
                responses += `회원가입: ${report.responses.completeRegistration}, `;
                responses += `결제 시도: ${report.responses.initiateCheckout}, `;
                responses += `리드: ${report.responses.lead}, `;
                responses += `검색: ${report.responses.search}, `;
                responses += `컨텐츠 뷰: ${report.responses.viewContent})`;
                return `${responses}\n\n`;
            },
            '총 구매 수': report => `${report.purchases.total} (1개당: ${report.purchases.unitCost} ${report.currency}; 확률: ${report.purchases.rate}%)\n\n`,
            '최고실적 연령/성별 (링크클릭)': (report) => {
                let mostLinkClicks = '\n\nTOP 5';
                report.genderAge.mostLinkClicks.forEach((entry) => {
                    mostLinkClicks += `\n\n${entry.gender} ${entry.age}: ${entry.value} (${entry.ratio}%)`;
                });
                return `${mostLinkClicks}\n\n`;
            },
            '최고실적 연령/성별 (구매)': (report) => {
                let mostPurchases = '\n\nTOP 5';
                report.genderAge.mostLinkClicks.forEach((entry) => {
                    mostPurchases += `\n\n${entry.gender} ${entry.age}: ${entry.value} (${entry.ratio}%)`;
                });
                return `${mostPurchases}\n\n`;
            },
            '최고실적 위치 (링크클릭)': (report) => {
                let mostLinkClicks = '\n\nTOP 5';
                report.region.mostLinkClicks.forEach((entry) => {
                    mostLinkClicks += `\n\n${entry.region}: ${entry.value} (${entry.ratio}%)`;
                });
                return `${mostLinkClicks}\n\n`;
            },
            '최고실적 위치 (구매)': (report) => {
                let mostPurchases = '\n\nTOP 5';
                report.region.mostLinkClicks.forEach((entry) => {
                    mostPurchases += `\n\n${entry.region}: ${entry.value} (${entry.ratio}%)`;
                });
                return `${mostPurchases}\n\n`;
            },
            '최고실적 시간 (링크클릭)': (report) => {
                let mostLinkClicks = '\n\nTOP 5';
                report.hour.mostLinkClicks.forEach((entry) => {
                    mostLinkClicks += `\n\n${entry.hour}시-${entry.hour + 1}시: ${entry.value} (${entry.ratio}%)`;
                });
                return `${mostLinkClicks}\n\n`;
            },
            '최고실적 시간 (구매)': (report) => {
                let mostPurchases = '\n\nTOP 5';
                report.hour.mostPurchases.forEach((entry) => {
                    mostPurchases += `\n\n${entry.hour}시-${entry.hour + 1}시: ${entry.value} (${entry.ratio}%)`;
                });
                return `${mostPurchases}\n\n`;
            },
        },
        en: {

        },
    },
};
