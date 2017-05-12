

var currIndex = 0;
var count = 4;
var timer;
var interval = 2000;

var creative = {};

creative.init = function(){
    creative.setupData();
    // Check if Enabler is initialized.
    if (Enabler.isInitialized()) {
        // Check if ad is visible to user.
        if (Enabler.isVisible()) {
            creative.initHandler();
        } else {
            Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, creative.initHandler);
        }
    } else {
        Enabler.addEventListener(studio.events.StudioEvent.INIT, creative.initHandler);
    }
};


creative.setupData = function(){
    var data = creative.data = {};
    data.SIZE = '728x90';
    data.TITLE = 'Sourcing Printing Machine?';
    data.SUB_TITLE = 'Get Free Quotations!';
    data.CATE2_URL = 'src=cpm_dbm&advertiser=alibaba';

    data.CATE3S = [{
        NAME:       'Digital Printers',
        EXIT_URL:   'src=cpm_dbm&advertiser=alibaba',
        IMG:        'cate_100006871.png'
    },{
        NAME:       'Inkjet Printers',
        EXIT_URL:   'src=cpm_dbm&advertiser=alibaba',
        IMG:        'cate_100006869.png'
    },{
        NAME:       'Offset Printers',
        EXIT_URL:   'src=cpm_dbm&advertiser=alibaba',
        IMG:        'cate_100006873.png'
    },{
        NAME:       'More',
        EXIT_URL:   'src=cpm_dbm&advertiser=alibaba',
        IMG:        'cate_100009431.png'
    }];
};

creative.initFillData = function(){
    var doms = creative.doms;
    var data = creative.data;
    $('ad-viewport').className = 'viewport viewport-' + data.SIZE;
    $('ad-title').innerHTML = data.TITLE;
    $('ad-sub-title').innerHTML = data.SUB_TITLE;
    for(var i=0;i< count; i++){
        $('js-ad-cate-name-'+i).children[0].innerHTML = data.CATE3S[i].NAME ;
        $('js-ad-cate-img-'+i).setAttribute('src', data.CATE3S[i].IMG);
    }
};

creative.initEventBind = function(){
    for(var i=0; i<count; i++){
        addEvent($('js-ad-cate-'+i), 'mouseover', function(index){
            return function(e){
                currIndex = index;
                creative.stopPlay();
                creative.hightlight(currIndex);
            }
        }(i));

        addEvent($('js-ad-cate-'+i), 'mouseout', function(){
            creative.autoPlay();
        });

        addEvent($('js-ad-cate-'+i), 'click', function(index){
            return function(e) {
                var nodeName = e.target.nodeName.toLowerCase();
                var url = creative.data.CATE3S[index].EXIT_URL;
                var pos ;
                if(nodeName == 'span' || nodeName == 'img'){
                    pos = e.target.getAttribute('data-pos');
                    creative.exit(url, pos, index);
                }
            }
        }(i));
    }

    var titleClicks = [$('ad-title'),$('ad-sub-title'),$('ad-footer')];
    for(var i=0;i<titleClicks.length; i++){
        addEvent(titleClicks[i], 'click', function(e){
            var url = creative.data.CATE2_URL;
            var pos = this.getAttribute('data-pos');
            creative.exit(url, pos);
        });
    }

};


creative.initHandler = function(){
    creative.initFillData();
    $('ad-viewport').style.display = 'block';
    creative.initEventBind();
    creative.hightlight(0);
    currIndex = -1;
    creative.autoPlay();
};


creative.hightlight = function(hoverIndex){
    for(var i=0; i<count; i++){
        if(i == hoverIndex){
            $('js-ad-cate-'+i).className = 'item item-hover';
            continue;
        }
        $('js-ad-cate-'+i).className = 'item';
    }
};

creative.autoPlay = function () {
    timer = setTimeout(function(){
        currIndex = (currIndex+1)>=count? 0 : (currIndex+1);
        creative.hightlight(currIndex);
        creative.autoPlay();
    }, interval);
};

creative.stopPlay = function(){
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
};

creative.exit = function (url, pos, index) {

    var insertion_order_id = "";
    var lnm = "";
    var crea = "";
    var xbid_auction_id = "";
    var xbid_exchange_id = "";
    var xbid_url = "";
    var crid = "";

    insertion_order_id = Enabler.getParameter("insertion_order_id");
    lnm = Enabler.getParameter("lnm");
    crea = Enabler.getParameter("crea");
    xbid_auction_id =  Enabler.getParameter("xbid_auction_id")
    xbid_exchange_id = Enabler.getParameter("xbid_exchange_id");
    xbid_url = Enabler.getParameter("xbid_url");
    crid = Enabler.getParameter("crid");

    url += "&insertion_order_id="+insertion_order_id+"&lnm="+lnm+"&crea="+crea
        +"&xbid_auction_id="+xbid_auction_id+"&xbid_exchange_id="+xbid_exchange_id
        +"&xbid_url="+xbid_url+"&crid="+crid;

    if(url.indexOf('?')>0) {
        url += '&pos=' + pos;
    }else{
        url += '?pos=' + pos;
    }
    if(index !== undefined){
        url += '-' + index;
    }
    // because: doubleclick 不允许变量赋值
    // Enabler.exitQueryString('exit-'+pos, url);
    if(pos === 'title'){
        Enabler.exitQueryString('exit-title', url);
    }else if(pos === 'subtitle'){
        Enabler.exitQueryString('exit-subtitle', url);
    }else if(pos === 'list'){
        switch(index){
            case 0 : Enabler.exitQueryString('exit-list-0', url); break;
            case 1 : Enabler.exitQueryString('exit-list-1', url); break;
            case 2 : Enabler.exitQueryString('exit-list-2', url); break;
            case 3 : Enabler.exitQueryString('exit-list-3', url); break;
        }
    }else if(pos === 'img'){
        switch(index){
            case 0 : Enabler.exitQueryString('exit-img-0', url); break;
            case 1 : Enabler.exitQueryString('exit-img-1', url); break;
            case 2 : Enabler.exitQueryString('exit-img-2', url); break;
            case 3 : Enabler.exitQueryString('exit-img-3', url); break;
        }
    }else if(pos === 'footer'){
        Enabler.exitQueryString('exit-footer', url);
    }

};


addEvent(window, 'load', creative.init);











// common
function $ (id) {
    return document.getElementById(id);
}

function addEvent( obj, type, fn ) {
  if ( obj.attachEvent ) {
    obj['e'+type+fn] = fn;
    obj[type+fn] = function(){
        var event = window.event;
        event.target = event.srcElement;
        obj['e'+type+fn]( event );
    }
    obj.attachEvent( 'on'+type, obj[type+fn] );
  } else
    obj.addEventListener( type, fn, false );
}
function removeEvent( obj, type, fn ) {
  if ( obj.detachEvent ) {
    obj.detachEvent( 'on'+type, obj[type+fn] );
    obj[type+fn] = null;
  } else
    obj.removeEventListener( type, fn, false );
}

