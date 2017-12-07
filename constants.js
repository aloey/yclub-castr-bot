
const appointmentBound = 2;

const features = {
    MAIN: 'MAIN',
    FAQ: 'FAQ',
    BLOG: 'BLOG',
    CARD_NEWS: 'CARD_NEWS',
    SUPPORT: 'SUPPORT',
    REPORT: 'REPORT',
};

const answer = {
    yes: 'YES',
    no: 'NO',
};

const mainMenu = {
    kr: '메인메뉴',
    en: 'Main menu',
};

const mainOptions = {
    kr: {
        질의응답: features.FAQ,
        블로그: features.BLOG,
        카드뉴스: features.CARD_NEWS,
        고객상담서비스: features.SUPPORT,
        리포트: features.REPORT,
    },
    en: {
        FAQ: features.FAQ,
        Blogs: features.BLOG,
        'Card News': features.CARD_NEWS,
        'Customer Support': features.SUPPORT,
        Reports: features.REPORT,
    },
};

const custom = {
    kr: '직접 입력',
    en: 'Custom',
};

const changeDate = {
    kr: '날짜 변경',
    en: 'Change date',
};

const dateFormat = {
    kr: {
        display: 'YYYY/MM/DD',
        pattern: '^\\D*(\\d{4})\\D*(\\d{1,2})\\D*(\\d{1,2})\\D*$',
        ord: [2, 3, 1],
    },
    en: {
        display: 'MM/DD/YYYY',
        pattern: '^\\D*(\\d{1,2})\\D*(\\d{1,2})\\D*(\\d{4})\\D*$',
        ord: [1, 2, 3],
    },
};

const nameFormat = '^(.+?)\\s*\\d+';
const phoneFormat = '\\D*(\\d{2,3})\\D*(\\d{3,4})\\D*(\\d{3,4})\\D*$';

const timeFormat = {
    kr: 'H:mm',
    en: 'H:mm',
};

const confirm = {
    kr: {
        동의함: answer.yes,
        동의하지않음: answer.no,
    },
    en: {
        Confirm: answer.yes,
        'Do not continue': answer.no,
    },
};

const castrHost = 'http://api.dev.castr.ai/api/';
const blogListUrl = `${castrHost}blog/blog`;
const cardNewsListUrl = `${castrHost}blog/card-news`;
const dateTimeListUrl = `${castrHost}support/appointment`;

const locale = 'kr';
const timezone = 'Asia/Seoul';

exports.features = features;
exports.mainMenu = mainMenu;
exports.mainOptions = mainOptions;
exports.castrHost = castrHost;
exports.urls = {
    blog: blogListUrl,
    cardNews: cardNewsListUrl,
    supportDateTime: dateTimeListUrl,
};
exports.custom = custom;
exports.dateFormat = dateFormat;
exports.timeFormat = timeFormat;
exports.changeDate = changeDate;
exports.confirm = confirm;
exports.appointmentBound = appointmentBound;
exports.answer = answer;
exports.nameFormat = nameFormat;
exports.phoneFormat = phoneFormat;
exports.locale = locale;
exports.timezone = timezone;
