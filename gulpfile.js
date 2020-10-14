const path = require('path');
const gulp = require('gulp');
const replace = require('gulp-replace');
const nunjucks = require('gulp-nunjucks-render');
const base64 = require('gulp-base64-v2');
const inline = require('gulp-inline');
const del = require('del');
const minify = require('gulp-minify');

const I18n = require('./node_modules/@dwp/govuk-casa/lib/I18n');

const I18nUtility = I18n([path.resolve(__dirname, './app/locales')], ['en', 'cy']);

const i18nTranslator = new I18nUtility.Translator('en');

const manageEnv = (environment) => {
  environment.addGlobal(
    't',
    i18nTranslator.t.bind(i18nTranslator),
  );
};

gulp.task('assetCompile', () => gulp
  .src(['./node_modules/@dwp/govuk-casa/dist/casa/css/casa.css'])
  .pipe(replace('~~~CASA_MOUNT_URL~~~govuk/frontend', ''))
  .pipe(base64({
    baseDir: './node_modules/govuk-frontend',
    maxImageSize: 130000,
    debug: true,
  }))
  .pipe(gulp.dest('./app/views/casa/errors/external')));

gulp.task('compile', () => gulp.src('./app/views/casa/errors/external/*.njk')
  .pipe(nunjucks({
    path: ['./node_modules/govuk-frontend', './app/views', './node_modules/@dwp/govuk-casa/views'],
    data: {
      govuk: {
        components: {
          header: {
            serviceName: i18nTranslator.t('app:serviceName'),
            serviceUrl: '/',
            homepageUrl: 'https://www.gov.uk/',
          },
        },
      },
    },
    manageEnv,
  }))
  .pipe(replace(`<!-- CASA -->
<!--[if gt IE 8]><!--><link href="govuk/casa/css/casa.css?" rel="stylesheet" /><!--<![endif]-->
<!--[if lte IE 8]>
<link href="govuk/casa/css/casa-ie8.css?" rel="stylesheet" />
<![endif]-->
<!-- /CASA -->`, '<link href="casa.css" rel="stylesheet" />'))
  .pipe(replace(`  <!-- CASA -->
<script src="govuk/frontend/js/all.js?"></script>
<script src="govuk/frontend/js/govuk-template.js?"></script>
<script src="govuk/casa/js/casa.js?"></script>
<!-- /CASA -->`, ''))
  .pipe(replace('/assets/images/favicon.ico', 'data:image/x-icon;base64,AAABAAIAEBAQAAEABAAoAQAAJgAAACAgAAABACAAqBAAAE4BAAAoAAAAEAAAACAAAAABAAQAAAAAAIAAAAAAAAAAAAAAABAAAAAAAAAALi0xACAfIwD///8AdHN2APHx8QBmZWgAWFdaAKurrQBKSUwAnZ2fAJCPkQDj4+QA1dXWAMfHyAC5uboAPDs/ABEREREREREREREREREREREREREREREREREC3d3d2yERETzUdEdOxRERu82e19u9ERazt3vK3DuBHeFGCqA0HtETkWEZkRgZMRMji6JKmDIxEG3enNeb1gERH4GkKhjxERERER1xERERERERERERERERERERERERERERERERERERAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAADcAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA3AAAAPMAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAADzAQEB7QUEBP8FBAT/BQQE/wUEBP8FBAT/BQQE/wUEBP8FBAT/BQQE/wUEBP8FBAT/BQQE/wUEBP8FBAT/BQQE/wUEBP8FBAT/BQQE/wUEBP8FBAT/BQQE/wUEBP8FBAT/BQQE/wUEBP8FBAT/BQQE/wUEBP8FBAT/BQQE/wEBAe0CAgLtDAsL/wwLC/8MCwv/DAsL/wwLC/8MCwv/DAsL/wwLC/8MCwv/DAsL/wwLC/8MCwv/DAsL/wwLC/8MCwv/DAsL/wwLC/8MCwv/DAsL/wwLC/8MCwv/DAsL/wwLC/8MCwv/DAsL/wwLC/8MCwv/DAsL/wwLC/8MCwv/AgIC7QICAu0LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8CAgLtAgIC7QsKCv8LCgr/CwoK/wwLC/8CAQH/AAAA/wEAAP8EAwP/BgUF/wgHB/8KCQn/CgkJ/woJCf8KCQn/CgkJ/woJCf8KCQn/CgkJ/woJCf8KCQn/BwYG/wUEBP8EAwP/AQAA/wAAAP8DAgL/DAsL/wsKCv8LCgr/CwoK/wICAu0CAgLtCwoK/wsKCv8LCgr/BgYG/zY1Nf9GRUX/Ly4u/yEgIP8SERH/CQgI/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wEAAP8NDAz/FxYW/yEgIP8vLi7/TExM/zY1Nf8FBAT/CwoK/wsKCv8LCgr/AgIC7QICAu0LCgr/CwoK/wkICP8FBAT/yMjI///////5+fn/5ubm/9XV1f/Ly8v/v7+//729vf+qqqr/pqam/6empv+npqb/pqam/6qqqv+9vb3/wcHB/8/Pz//b2tr/5ubm//n5+f//////r66u/wAAAP8KCQn/CwoK/wsKCv8CAgLtAgIC7QsKCv8LCgr/AwIC/ygnJ//09PT////////////////////////////////////////////////////////////////////////////////////////////////////////////k5OT/FRQU/wYFBf8LCgr/CwoK/wICAu0CAgLtCwoK/wsKCv8AAAD/amlp///////BwMD/cnJy/8bGxv///////////9PT0/+xsbH/x8fH//7+/v////////////j4+P+8vLz/srKy/9/f3////////////7u7u/93d3f/1tbW//////9JSEj/AAAA/wsKCv8LCgr/AgIC7QICAu0LCgr/CAcH/wUEBP/My8v/srKy/wkICP8AAAD/JCMj//v7+/+Lior/BQQE/wAAAP8AAAD/YWBg//z8/P/y8vL/RUVF/wAAAP8AAAD/EA8P/6Kiov/n5+f/Dg0N/wAAAP8ZGBj/zMvL/6enp/8AAAD/CwoK/wsKCv8CAgLtAgIC7QsKCv8AAAD/PTw8//f39/+Xlpb/aGho/1BPT/9PTk7/8fHx/xwbG/8AAAD/NDMz/2dmZv8AAAD/zc3N/6moqP8AAAD/enl5/ycmJv8AAAD/Ly4u/+jo6P9DQkL/WFdX/2RjY/+mpaX/8fDw/yUkJP8CAQH/CwoK/wICAu0CAgLtCQgI/wAAAP+srKz//f39//n5+f9YV1f/7u7u////////////x8bG/46Njf86Ojr//////6Ghof/Gxsb/wcDA/7i3t//39/f/Ly4u/5mZmf/GxcX////////////V1NT/ZmVl///////8/Pz/k5KS/wAAAP8KCQn/AgIC7QICAu0AAAD/XVxc//////+lpKT/rays/wkHB/9OTk7/2dnZ//f39//p6en/c3Nz/0dGRv//////v7+///Py8v/j4+P/xsbG//////80MzP/l5aW/+np6f/6+vr/wsLC/zw8PP8XFhb/tLOz/6ampv//////QUBA/wEBAf8CAgLtAQEB7QAAAP9ERET/p6en/21sbP8oJyf/AQEB/yQjI//v7+//5+fn/ygnJ/8AAAD/RkVF/0A/P/80NDT/9/f3/+Pj4/8dHBz/VVRU/zU0NP8AAAD/ODg4//n5+f/e3d3/ExIS/wkICP8wLy//enl5/6ampv8yMTH/AAAA/wICAu0AAADtQkFB/7Ozs/+dnZ3/IyEh/wAAAP8AAAD/c3Jy///////v7+//IB8f/wEAAP8DAgL/FhUV/9vb2////////////8XExP8KCQn/BgUF/wAAAP82NTX///////////9YV1f/AAAA/wAAAP8vLi7/q6ur/7S0tP82NTX/AQAA7QAAAO3BwcH///////////9vbm7/AAAA/wAAAP9gX1///////87Nzf8MCwv/CAcH/wcGBv8eHR3/SkpK/z8+Pv9APz//S0tL/xoZGf8HBwf/BQQE/xkYGP/i4uL//////0VERP8AAAD/AAAA/5KSkv///////////6empv8AAADtAAAA7ZiYmP///////////09OTv8BAQH/BQQE/yEgIP+8vLz/Q0JC/wEBAf8LCgr/DAsL/wgHB/8AAAD/AAAA/wAAAP8AAAD/CQgI/wwLC/8MCgr/AAAA/1taWv+xsLD/Dg0N/wcGBv8AAAD/a2tr////////////e3p6/wAAAO0BAQHtFxYW/2JhYf9SUVH/AQAA/wQDA/8MCwv/CAcH/wkICP8DAgL/CAcH/wQDA/8JCAj/AwMD/1VUVP/Kysr/xcXF/0dGRv8DAwP/CAcH/wQDA/8IBwf/BQQE/wkICP8JCAj/DAsL/wEAAP8GBAT/YF9f/11dXf8NDAz/AQEB7QICAu0AAAD/MzEx/8LCwv+1tbX/IB8f/wUFBf8IBwf/CAcH/wYFBf8NDAz/IB8f/wEAAP8LCgr/39/f////////////x8bG/wMDA/8FBAT/IyIi/wkICP8HBgb/CAcH/wkICP8EAwP/NjU1/8XFxf+3t7f/IyIi/wIBAf8CAgLtAAAA7QMCAv/BwcH///////////94d3f/AAAA/wYFBf8AAAD/FxYW/7y8vP/s7Oz/goKC/wUFBf/Z2Nj////////////ExMT/CAcH/52dnf/u7u7/paSk/woJCf8AAAD/AwIC/wAAAP+joqL///////////+enp7/AAAA/wEBAe0BAQHtAQEB/42Njf///////////1ZVVf97enr/wMDA/1dWVv9EQ0P////////////w8PD/CAcH/42MjP///////////3d3d/8fHh7/////////////////Kikp/3Z1df+8vLz/X19f/29ubv///////////3Jxcf8AAAD/AgEB7QICAu0JBwf/Dw4O/11cXP8/Pj7/NzY2////////////7u/v/y4tLf/Pz8///Pz8/6moqP8AAAD/NjU1///////8+/v/JCMj/wUEBP+/vr7/+/v7/7Gxsf80MzP////////////8+/v/HBsb/0tLS/9QTk7/CgkJ/wkICP8CAgLtAgIC7QwLC/8IBwf/AAAA/wAAAP8lJCT/6+vr///////V1dX/CwoK/xkYGP80MzP/GhkZ/5CQkP9VVFT/4uLi/9HQ0P9mZmb/kJCQ/xAPD/81NDT/DAwM/xkYGP/o6Oj//////9zb2/8TEhL/AAAA/wAAAP8JCAj/CwoK/wICAu0CAgLtCwoK/wsKCv8LCgr/CwoK/wMCAv85OTn/bWxs/yopKf8GBQX/BQQE/wAAAP8MCwv/6ejo///////5+Pj/9/f3///////W1tb/AAAA/wAAAP8GBQX/BQQE/zg4OP9ubW3/Li0t/wYFBf8LCgr/CwoK/wsKCv8LCgr/AgIC7QICAu0LCgr/CwoK/wsKCv8LCgr/CwoK/wEAAP8AAAD/AwIC/wwLC/8LCgr/BwYG/xMSEv+8u7v/sbGx/+7u7v/e3t7/tbW1/7e2tv8DAgL/CgkJ/wsKCv8LCgr/AQAA/wAAAP8CAQH/DAoK/wsKCv8LCgr/CwoK/wsKCv8CAgLtAgIC7QsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8KCQn/Dw4O/w8ODv8dHBz/9vb2/9vb2/8ODQ3/FhUV/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wICAu0CAgLtCwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/AAAA/2hnZ////////////0tKSv8AAAD/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/CwoK/wsKCv8LCgr/AgIC7QICAu0KCQn/CgkJ/woJCf8KCQn/CgkJ/woJCf8KCQn/CgkJ/woJCf8KCQn/CgkJ/woJCf8ICAj/JCMj/zc2Nv83Nzf/Hh0d/wgICP8KCQn/CgkJ/woJCf8KCQn/CgkJ/woJCf8KCQn/CgkJ/woJCf8KCQn/CgkJ/woJCf8CAgLtAAAA7QEBAf8BAQH/AQEB/wEBAf8BAQH/AQEB/wEBAf8BAQH/AQEB/wEBAf8BAQH/AQEB/wEBAf8AAAD/AAAA/wAAAP8AAAD/AQEB/wEBAf8BAQH/AQEB/wEBAf8BAQH/AQEB/wEBAf8BAQH/AQEB/wEBAf8BAQH/AQEB/wAAAO0AAADzAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA8wAAANwAAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADtAAAA7QAAAO0AAADcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='))
  .pipe(inline({
    base: './node_modules/govuk-frontend',
  }))
  .pipe(gulp.dest('dist')));

gulp.task('clean', () => del(['./app/views/casa/errors/external/casa.css']));

gulp.task('default', gulp.series('assetCompile', 'compile', 'clean'));

gulp.task('minifyjs', () => gulp
  .src('app/src/js/timeout.js')
  .pipe(minify({
    ext: {
      min: '.min.js',
    },
    noSource: true,
  }))
  .pipe(gulp.dest('app/static/esa/js')));
