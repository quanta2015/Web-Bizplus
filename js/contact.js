
var CONTACT = {
  onReady: function () {
    initGlobel(function(langDB) {
      _langDB = langDB;
      renderMenu();
      renderFoorter();
      initLanguageMenu();
      CONTACT.render();
    })
  },

  initMap: function() {
    googlemap(compangList[0])
    googlemap(compangList[1])
    googlemap(compangList[2])
  },

  render: function () {
    
    renderTmpl('/tmpl/contact/contact.tmpl', function (r) {
      $('.m-contact').append($.templates(r).render(e, rdHelper));
      CONTACT.initMap();
    })
   
  }
}

$(CONTACT.onReady);


compangList = [{
  "name":"東京本社",
  "code":"〒162-0067",
  "tel":"TEL 03-6709-8260",
  "fax":"FAX 03-6709-8261",
  "addr":"東京都新宿区富久町1番5号富久町第5服部ビル2階",
  "lat":"35.6918821",
  "lng":"139.7188033",
  "id":"office-tokyo__map"
},{
  "name":"大阪支社",
  "code":"〒162-0067",
  "tel":"TEL 03-6709-8260",
  "fax":"FAX 03-6709-8261",
  "addr":"大阪市西区西本町2-1-34 SONO西本町ビル4階C号室",
  "lat":"34.68289830000001",
  "lng":"135.49180190000004",
  "id":"office-osaka__map"
},{
  "name":"中国西安支社",
  "code":"〒710077",
  "tel":"TEL 029-89368167",
  "fax":"FAX 029-89368167",
  "addr":"陕西省西安市未央区辛家庙新建国大厦10906号",
  "lat":"34.311827",
  "lng":"109.00838199999998",
  "id":"office-xian__map"
}]


function googlemap(o) {
  var contentString = `<div class="m-info"><div class="m-head"><h1>${o.name}</h1><span>${o.code}</span></div><p class="m-addr"><span>${o.tel}</span><span>${o.fax}</span><span>${o.addr}</span></p></div>`;

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var markerImg = new google.maps.MarkerImage('../imgs/marker.png');
    markerImg.scaledSize = new google.maps.Size(23, 32);

    var mapStyle =
      [{"featureType": "all",
        "elementType": "all",
        "stylers": [{
          "saturation": "-100"
        }]
      }];

    // 東京オフィス
    var latlng1 = new google.maps.LatLng(o.lat, o.lng);
    var myOptions = {
      zoom: 14,
      center: latlng1,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      styles: mapStyle
    };
    var map_tokyo = new google.maps.Map(
      document.getElementById(o.id),
      myOptions
    );
    var marker = new google.maps.Marker({ 
      position: latlng1,
      map: map_tokyo,
      icon: markerImg,
      title: "A1インターナショナル株式会社 東京オフィス"
    });

    infowindow.open(map_tokyo, marker);
}
