var $ = require('jquery'),
    Projects = require('./projects.js'),
    Handlebars = require('handlebars'),
    Fuse = require('fuse.js'),
    ClickOrTouch = require('@avvio-reply/clickortouch'),
    Slick = require('slick-carousel');

$(document).ready(function() {

    var templates = {
        "projectTile":Handlebars.compile($('#projectTile').html()),
        "project":Handlebars.compile($('#project').html())
    };

    renderPage();

    if (window.history && window.history.pushState) {

        $(window).on('popstate', function() {
          var hashLocation = location.hash;
          var hashSplit = hashLocation.split("#!/");
          var hashName = hashSplit[1];

          if (hashName !== '') {
            var hash = window.location.hash;
            if (hash === '') {
                closePopup();
            }
          }
        });

        // window.history.pushState('forward', null, '/showcase/');
        window.history.pushState('forward', null, '/');
    }

    function renderPage() {

        Projects.sort(sortByDate);

        //Display all projects
        Projects.forEach(function(project) {

            var model = {
                "id":project.id,
                "contentFolder":project.contentFolder,
                "projectName":project.name,
                "tags":project.tags,
                "client":project.client.replace(/[\. ,':-]+/g, "")
            }

            $('.projects').append(templates.projectTile(model));
        });

        //Setup search
        var options = {
            threshold: 0.1,
            shouldSort: true,
            keys: ['client', 'name', 'tags'],
            id: 'id'
        }
        var fuse = new Fuse(Projects, options);

        //Listen for search terms
        $('.search-form__input').keyup(function() {
            searchTerm = $(this).val();

            var results = fuse.search(searchTerm);

            if (searchTerm != "") {
                $('[data-id]').hide();

                results.forEach(function(result) {
                    $('[data-id="' + result + '"]').show();
                });
            }
            else {
                $('[data-id]').show();
            }

            $('.search__highlight').text(searchTerm);
        });

        if (document.location.hash) {
            loadProject();
        }
    };

    function loadProject() {

        var projectNumber = window.location.hash.substr(1);

        project = Projects.filter(function (projects) { return projects.id == projectNumber });
        project = project[0];

        var projectImages = [];

        for (i = 1; i < project.noImages + 1; i++) {
            projectImages.push([i] + '.png');
        }

        var model = {
            "id":project.id,
            "contentFolder":project.contentFolder,
            "images":projectImages,
            "projectName":project.name,
            "client":project.client,
            "description":project.description,
            "notes":project.notes,
            "tags":project.tags,
            "playableLink":project.playableLink,
            "githubLink":project.githubLink
        }

        $('body')
            .append(templates.project(model))
            .addClass('scroll-lock');

        // setTimeout(function(){
        //     $('.project-detail__images').slick({
        //         dots: true,
        //         dotsClass: 'project-images__dots',
        //         prevArrow: '<i class="fas fa-chevron-left slick-prev"></i>',
        //         nextArrow: '<i class="fas fa-chevron-right slick-next"></i>',
        //         infinite: true,
        //         speed: 500,
        //         fade: true,
        //         cssEase: 'linear',
        //         adaptiveHeight: true
        //     });
        // }, 100);
    }

    $(window).on('hashchange', function() {
        if (document.location.hash) {
            loadProject();
        }
    });

    function closePopup() {
        history.replaceState(null, null, ' ');
        $('.overlay').remove();
        $('body').removeClass('scroll-lock');
    }

    function sortByDate(a, b){
        var year1 = a.year;
        var year2 = b.year;

        var month1 = a.month;
        var month2 = b.month;

        if (year1 < year2) return 1;
        if (year1 > year2) return -1;
        if (month1 < month2) return 1;
        if (month1 > month2) return -1;
        return 0;
    }

    //Setup click event for search
    new ClickOrTouch('[data-search-toggle]', false, function(e){
        window.scrollTo(0, 0);
        $('.search').toggleClass('search--open');
        $('.search-form__input').focus();
    });

    new ClickOrTouch('.filter', false, function(e){
        $('.projects__filter').toggleClass('projects__filter--open');
    });

    new ClickOrTouch('.project-detail__close', false, function(e){
        closePopup();
    });
});