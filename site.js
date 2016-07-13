const site = {
    port:        8088,        // cổng server local sẻ sử dụng
    contentRoot: './content', // thư mục chứa content file cho metalsmith
    buildRoot:   './build',   // thư mục chứa output của metalsmith
    layoutRoot:  './layout',  // thư mục layout của handlebars

    // thư mục chứa style của site, sẽ build vào ${buildRoot}/css/
    styleRoot: './style',

    // thư mục chứa style của site, sẽ build vào ${buildRoot}/js/
    scriptRoot: './script',

    // thư mục chứa các script, css, fonts, image của vendor
    // tât cả sẽ được copy (giữ nguyên câu trúc) qua ${buildRoot}
    // ở chế độ production cũng sẽ không minify
    assetRoot: './asset',

    // global metadata của site
    metadata: {
        site: {
            title: 'VTA Mobile',
            description: 'Metalsmith static site generator for Foundation for Sites VTA Mobile',
            keywords: 'easy web, thiết kế web đơn giản,',
            author: 'Gatta Desmond',
            url: ''
        }
    }
};

site.script = {
    concat:     true,     // concat == true sẽ nhập các file script lại thành 1 file duy nhất
    concatName: 'app.js', // tên của file script sau khi nhập, mặc định là app.js
    files:      [
        // ví dụ
        "bower_components/jquery/dist/jquery.js",
        "bower_components/what-input/what-input.js",
        // // Core Foundation files
        "bower_components/foundation-sites/js/foundation.core.js",
        "bower_components/foundation-sites/js/foundation.util.*.js",

        "bower_components/foundation-sites/js/foundation.abide.js",
        "bower_components/foundation-sites/js/foundation.accordion.js",
        "bower_components/foundation-sites/js/foundation.accordionMenu.js",
        // "bower_components/foundation-sites/js/foundation.drilldown.js",
        "bower_components/foundation-sites/js/foundation.dropdown.js",
        // "bower_components/foundation-sites/js/foundation.dropdownMenu.js",
        "bower_components/foundation-sites/js/foundation.equalizer.js",
        "bower_components/foundation-sites/js/foundation.interchange.js",
        "bower_components/foundation-sites/js/foundation.magellan.js",
        // "bower_components/foundation-sites/js/foundation.offcanvas.js",
        // "bower_components/foundation-sites/js/foundation.orbit.js",
        "bower_components/foundation-sites/js/foundation.responsiveMenu.js",
        "bower_components/foundation-sites/js/foundation.responsiveToggle.js",
        // "bower_components/foundation-sites/js/foundation.reveal.js",
        // "bower_components/foundation-sites/js/foundation.slider.js",
        "bower_components/foundation-sites/js/foundation.sticky.js",
        "bower_components/foundation-sites/js/foundation.tabs.js",
        "bower_components/foundation-sites/js/foundation.toggler.js",
        "bower_components/foundation-sites/js/foundation.tooltip.js",

        "bower_components/classie/classie.js",
        "bower_components/typeahead.js/dist/typeahead.jquery.min.js",
        "bower_components/slideout.js/dist/slideout.min.js",
        "bower_components/Swiper/dist/js/swiper.min.js",
        "bower_components/jquery.countdown/dist/jquery.countdown.min.js",
        "bower_components/lazysizes/lazysizes.min.js",

        // thêm các file script của site ở đây
        // muốn concat đúng thứ tự thì phải define path
        `${site.scriptRoot}/!(app).js`,// các file có tên khác 'app.js'
        `${site.scriptRoot}/app.js`
    ]
};

site.style = {
    sass:         {
        // đường dẫn tơi các thư viện sass, có thể load bằng @import
        includePaths: [
            'bower_components',
            // ví dụ
            'bower_components/foundation-sites/scss',
            "bower_components/motion-ui/src",
            "bower_components/SpinKit/scss"
        ]
    },
    autoprefixer: {
        browsers: ['last 2 version', '> 1%' ,'ios 7']
    }
};

// define và config các plugin của metalsmith
site.metalsmith = {
    'metalsmith-drafts':        {
        '_enable': false
    },
    'metalsmith-matters':       {
        '_enable': true,
        'delims':  ['---json', '---'],
        'options': {
            'lang': 'json'
        }
    },

    'metalsmith-markdown':      {
        '_enable':     true,
        'smartypants': true,
        'smartLists':  true,
        'gfm':         true,
        'tables':      true
    },

    'metalsmith-collections':   {
        '_enable': true,
        // collection theo file pattern + test limit
        'blog':    {
            'pattern': 'blog/**/*.html',
            'sortBy':  'date',
            'reverse': true,
            'limit':   2
        },
        // collection theo key trong metadata `"collection": "baiviet"`
        'baiviet': {
            'sortBy':  'date',
            'reverse': true
        }
    },

    'metalsmith-permalinks':    {
        '_enable':  false,
        // default config
        // 'pattern':  ':title',
        'relative': false,
        // config rieng cho 1 collection
        linksets:   [{
            match:   {collection: 'blog'},
            pattern: ':title'
        }]
    },

    'metalsmith-pagination':    {
        '_enable': true,
        'collections.blog':    {
            'perPage':   1,
            'layout':    'blog.html',
            'first':     'blog/index.html',
            'path':      'blog/:num/index.html',
            'noPageOne': true
        },
        // test filter
        'collections.baiviet': {
            'perPage':   1,
            'layout':    'blog.html',
            'first':     'baiviet/index.html',
            'path':      'baiviet/:num/index.html',
            'filter':    meta => {
                return meta.dacbiet === false;
            },
            'noPageOne': true
        }
    },

    'metalsmith-layouts':       {
        '_enable':   true,
        'engine':    'handlebars',
        'directory': `${site.layoutRoot}`,
        'partials':  `${site.layoutRoot}/partial`
    },

    'metalsmith-html-minifier': {
        '_enable':               true,
        'removeAttributeQuotes': false,
        'keepClosingSlash':      true,
        'removeRedundantAttributes': false
    }
};

module.exports = site;
