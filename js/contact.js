
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
    list = _langDB[_langDB.cur].contact.map_list
    list.map(function(i,index) {
      googlemap(i,index)
    })
  },

  render: function () {
    renderTmpl('/tmpl/contact/contact.tmpl', function (r) {
      data = _langDB[_langDB.cur].contact
      $('.m-contact').append($.templates(r).render(data, rdHelper));
      CONTACT.initMap();
    })
  }
}

$(CONTACT.onReady);


function googlemap(o,index) {
  var contentString = `<div class="m-info"><div class="m-head"><h1 data-locate='contact.map_list[${index}].name'>${o.name}</h1><span>${o.code}</span></div><p class="m-addr"><span>${o.tel}</span><span>${o.fax}</span><span data-locate='contact.map_list[${index}].addr'>${o.addr}</span></p></div>`;

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
