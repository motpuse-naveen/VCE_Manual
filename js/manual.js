
(function () {
    var spinner = function () {
        setTimeout(function () {
            if ($("#spinner").length > 0) {
                $("#spinner").removeClass("show");
            }
        }, 1);
    };
    spinner(0);
    
    // Initiate the wowjs
    new WOW().init();

    const toggler = document.querySelector("#sidebarCollapse");
    toggler.addEventListener("click", function () {
        document.querySelector("#sidebar").classList.toggle("collapsed");
        document.querySelector("#manual-content-wrapper").classList.toggle("sidebar-padding");
        this.classList.toggle("active");
    });

    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    $(document).ready(function () {
        var manualTitle = getParameterByName("mt");
        var manualCode = getParameterByName("mc");
        var manualFolder = getParameterByName("mf");

        if(manualFolder==null || manualFolder==undefined || manualFolder==""){
            manualFolder = manualCode.replace("/","_");
        }
        VCE_Manual.InitManual(manualTitle, manualCode, manualFolder);
    });

})();

$(document).on("click", ".sidebar-link", function (event) {
    var menuTitle = $(this).text().replace(/\n/g, '').trim();
    var mainMenuId = $(this).closest("ul").attr("id");
    var mainMenuTitle = "";
    if(mainMenuId!=undefined && mainMenuId != ""){
        if($("a.sidebar-link[data-bs-target='#" + mainMenuId + "']").length>0){
            mainMenuTitle = $("a.sidebar-link[data-bs-target='#" + mainMenuId + "']").text();
        }
    }
    menuItem = {
        page: menuTitle.replace(/ /g, '_').replace(/,/g, '').toLowerCase(),
        title: menuTitle,
        mainMenu: mainMenuTitle,
        mainMenuId: mainMenuId
    }
    console.log(menuItem);
    VCE_Manual.LoadMenuItem(menuItem, this);
});

$(document).on("click", ".nav.nav-tabs .nav-link", function (event) {
    $(".nav.nav-tabs .nav-link").removeClass("active");
});

$(document).on("click", ".nav-pills .nav-link", function(event){
    var tabId = $(this).attr("id");
    $(".nav-link-circle").removeClass("active");
    $("#" + tabId.replace("nav","num")).addClass("active");
    $(this).addClass("active");
});
$(document).on("click", ".instrument-container .nav-link-circle", function(event){
    debugger;
    $(".tab-pane").removeClass("active show")
    var tabtargetid = $(this).attr("data-bs-target");
    $(tabtargetid).tab("show");
    $(".nav-link-circle").removeClass("active");
    $(this).addClass("active");
});
/*
$(document).on("click", ".btn-tooltip", function(event){
    $('[data-toggle="tooltip"]').tooltip("hide").removeClass("active");
    $(this).tooltip('show',element,{
        container: element.parentElement,
    }).addClass("active");
});
*/
/*
$(document).on('click', function(e) {
    if (!$(e.target).closest('.btn-tooltip').length) {
      $(".btn-tooltip").tooltip('hide');  // Hide tooltip when clicking outside the button
    }
  });
  */

  

$(document).on("click", ".service-position button.step", function(event){
    var datastep = $(this).attr("data-step");
    $(".step.active").removeClass("active")
    $(this).addClass("active")
    $(".step-text").removeClass("active");
    $(".step-text." + datastep).addClass("active");
    $(".leftMachine .pos").addClass("disnone");
    $(".rightMachine .pos").addClass("disnone");
    $(".leftMachine .pos[data-step='" + datastep + "']").removeClass("disnone");
    $(".rightMachine .pos[data-step='" + datastep + "']").removeClass("disnone");
    $(".leftMachine").removeClass("step1 step2 step3 step4 step5 step6 step7 step8");
    $(".rightMachine").removeClass("step1 step2 step3 step4 step5 step6 step7 step8");
    $(".leftMachine").addClass(datastep);
    $(".rightMachine").addClass(datastep);
});

var VCE_Manual = (function () {
    var _manualFolder = "";
    var _manualTitle = "";
    var _manualCode = "";
    return {
      InitManual: function (manualTitle, manualCode, manualFolder) {
        _manualFolder = manualFolder;
        _manualTitle = manualTitle;
        _manualCode = manualCode;
        $("#navbarCollapse p.manual-title").html(_manualTitle);
        $("#navbarCollapse h2.manual-model").html(_manualCode);
        this.LoadMenu();
      },
      LoadMenu: function(){
        var menuUrl = "./partial-views/" + _manualFolder + "/" + "_menu.html"
        $("#sidebarContent" ).load(menuUrl, function( response, status, xhr ) {
            if ( status == "error" ) {
              var msg = "There was an error: ";
              console.log(msg + xhr.status + " " + xhr.statusText);
            }
            else{
                //Load default menu item.
                $("#sidebar ul li a:first").trigger("click");
            }
        });
      },
      LoadMenuItem: function(menuItem, p_this){
        var menuContentUrl = "./partial-views/" + _manualFolder + "/" + menuItem.page + ".html";
        var breadcrum = "";
        if(menuItem.mainMenu!=undefined && menuItem.mainMenu!=""){
            breadcrum = `<li class="breadcrumb-item">` + menuItem.mainMenu + `</li><li class="breadcrumb-item">` + menuItem.title + `</li>`;
        }
        else{
            breadcrum = `<li class="breadcrumb-item">` + menuItem.title + `</li>`;
        }
        $("nav.breadcrumb-panel ol.breadcrumb").html(breadcrum)
        $("a.sidebar-link").removeClass("active");
        $(p_this).addClass('active');
        $("a.sidebar-link[data-bs-target='#" + menuItem.mainMenuId + "']").addClass('active');
        $("#sidebar-link-content" ).load(menuContentUrl, function( response, status, xhr ) {
            /*$(".btn-tooltip").tooltip({
                trigger: 'manual',
                placement: function(tip, element) {
                  return element.getAttribute("data-placement"); // Use element.getAttribute instead of accessing attributes directly
                }
            });*/
            $(".btn-tooltip").each(function () {
                const element = this;
            
                // Initialize tooltip with the desired options
                $(element).tooltip({
                    trigger: 'manual',  // Manual trigger
                    container: element.parentElement,  // Set parent element as container
                    placement: function() {
                        return element.getAttribute("data-placement");  // Get placement from data attribute
                    }
                });
                
                // Show the tooltip and add the active class on click
                $(element).on('click', function() {
                    // Check if the current tooltip is already shown (has 'active' class)
                    if ($(element).hasClass("active")) {
                        // If active, hide the tooltip and remove the active class
                        $(element).tooltip('hide').removeClass("active");
                    } else {
                        // Hide any other open tooltips
                        $(".btn-tooltip").tooltip('hide').removeClass("active");

                        // Show the clicked tooltip and add the active class
                        $(element).tooltip('show').addClass("active");
                    }
                });
            });
              
            if ( status == "error" ) {
              var msg = "There was an error: ";
              console.log(msg + xhr.status + " " + xhr.statusText);
            }
        });
      }
    };
})();




