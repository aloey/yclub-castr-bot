
const appointmentBound = 2;

const features = {
    main: 'MAIN',
    faq: 'FAQ',
    info: 'INFO',
    support: 'SUPPORT',
    report: 'REPORT',
};

const informations = {
    trend: 'TREND',
    manual: 'MANUAL',
    service: 'SERVICE',
};

const duration = {
    today: 'TODAY',
    yesterday: 'YESTERDAY',
    week: 'WEEK',
    week4: 'WEEK4',
    lifetime: 'LIFETIME',
};

const answer = {
    yes: 'YES',
    no: 'NO',
};

const mainMenu = {
    kr: '메인 메뉴',
    en: 'Main menu',
};

const mainOptions = {
    kr: {
        질의응답: features.faq,
        정보: features.info,
        고객상담서비스: features.support,
        리포트: features.report,
    },
    en: {
        FAQ: features.faq,
        Information: features.info,
        'Customer Support': features.support,
        Reports: features.report,
    },
};

const infoSubOptions = {
    kr: {
        트렌드: informations.trend,
        사용설명서: informations.manual,
        서비스소개: informations.service,
    },
    en: {
        Trend: informations.trend,
        Manual: informations.manual,
        'Castr Services': informations.service,
    },
};

const durationOptions = {
    kr: {
        오늘: duration.today,
        어제: duration.yesterday,
        '최근 1주': duration.week,
        '최근 4주': duration.week4,
        '전체 기간': duration.lifetime,
    },
    en: {
        Today: duration.today,
        Yesterday: duration.yesterday,
        'Past week': duration.week,
        'Past 4 weeks': duration.week4,
        Lifetime: duration.lifetime,
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
const fbCastHost = 'http://fbcast.castr.ai/';
const blogListUrl = `${castrHost}blog`;
const dateTimeListUrl = `${castrHost}support/appointment`;
const businessUrl = accountId => `${castrHost}companies/${accountId}/restaurants`;
const promotionUrl = castrbizId => `${castrHost}restaurants/${castrbizId}/promotions`;
const reportUrl = `${fbCastHost}insight/summary`;

const locale = 'kr';
const timezone = 'Asia/Seoul';

const platform = {
    kr: {
        facebook: '페이스북',
        instagram: '인스타그램',
        audienceNetwork: '어디언스 네트워크',
    },
    en: {
        facebook: 'Facebook',
        instagram: 'Instagram',
        audienceNetwork: 'Audience network',
    },
};

exports.features = features;
exports.informations = informations;
exports.mainMenu = mainMenu;
exports.mainOptions = mainOptions;
exports.infoSubOptions = infoSubOptions;
exports.castrHost = castrHost;
exports.urls = {
    blog: blogListUrl,
    supportDateTime: dateTimeListUrl,
    business: businessUrl,
    promotion: promotionUrl,
    report: reportUrl,
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
exports.duration = duration;
exports.durationOptions = durationOptions;
exports.platform = platform;
