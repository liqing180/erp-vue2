import i18n from '@/lang' // 国际化语言包
class MapClass {
  constructor() {
    this.map = null
    this.marker = null
    this.infoWindow = null
    this.geocoder = null
    this.markersArray = []
    this.backFn = null
    this.disabled = false
    this.splitCountry = false

    this.initMap = ({ dom, center, mapTypeId, inputDom, inputWarpDom, backFn, disabled, splitCountry }) => {
      // 是否将国家省份城市与地址分开
      this.splitCountry = splitCountry
      this.disabled = disabled
      this.backFn = backFn
      const google = window.google
      this.infoWindow = new google.maps.InfoWindow()
      this.map = new google.maps.Map(dom, {
        zoom: 13,
        minZoom: 4,
        center: center,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        mapTypeId: mapTypeId || 'roadmap' // 'terrain'
      })
      this.setCurrentPosition(this.map)
      this.geocoder = new google.maps.Geocoder()
      google.maps.event.addListener(this.map, 'click', (event) => {
        if (this.disabled) {
          return
        }
        this.placeMarker(event.latLng)
      })
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(inputWarpDom)
      // this.map.addListener('bounds_changed', () => {
      //   searchBox.setBounds(this.map.getBounds())
      // })
      const searchBox = new google.maps.places.SearchBox(inputDom)

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces()

        if (places.length === 0) {
          return
        }

        this.markersArray.forEach(function (marker) {
          marker.setMap(null)
        })
        this.markersArray = []

        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds()
        const arr = [places[0]]
        arr.forEach((place) => {
          if (!place.geometry) {
            console.log('Returned place contains no geometry')
            return
          }
          if (place.address_components && place.address_components.length > 0) {
            this.marker = new google.maps.Marker({
              map: this.map,
              title: place.name,
              position: place.geometry.location
            })
            this.markersArray.push(this.marker)

            this.attachSecretMessage(this.marker, place.geometry.location, place.formatted_address, place.address_components)
          } else {
            this.placeIdMarker(place.place_id)
          }

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport)
          } else {
            bounds.extend(place.geometry.location)
          }
        })
        this.map.fitBounds(bounds)
      })
    }

    this.placeIdMarker = (placeId) => {
      const google = window.google
      if (this.geocoder) {
        this.geocoder.geocode(
          { placeId: placeId },
          (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                this.clearOverlays(this.infoWindow) // 清除地图中的标记
                this.marker = new google.maps.Marker({
                  position: results[0].geometry.location,
                  map: this.map
                })
                this.markersArray.push(this.marker)
                this.attachSecretMessage(
                  this.marker,
                  results[0].geometry.location,
                  results[0].formatted_address,
                  results[0].address_components
                )
              }
            } else {
              alert('Geocoder failed due to: ' + status)
            }
          }
        )
      }
      /* this.clearOverlays(this.infoWindow) // 清除地图中的标记
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map
      })
      this.markersArray.push(this.marker)
      this.attachSecretMessage(
        this.marker,
        location,
        results[0].formatted_address,
        results[0].address_components
      ) */
    }

    this.placeMarker = (location) => {
      const google = window.google
      this.clearOverlays(this.infoWindow) // 清除地图中的标记
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map
      })
      this.markersArray.push(this.marker)
      // 根据经纬度获取地址
      if (this.geocoder) {
        this.geocoder.geocode(
          {
            location: location
          },
          (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                this.attachSecretMessage(
                  this.marker,
                  location,
                  results[0].formatted_address,
                  results[0].address_components
                )
              }
            } else {
              alert('Geocoder failed due to: ' + status)
            }
          }
        )
      }
    }

    this.setMarkerOrInfo = ({ location, address, addressEdit }) => {
      const google = window.google
      this.clearOverlays(this.infoWindow) // 清除地图中的标记
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map
      })
      this.markersArray.push(this.marker)
      let message =
        `<b>${i18n.t('mapLang.coordinates')} : </b>` +
        location.lat +
        ' , ' +
        location.lng +
        '<br />' +
        `<b>${i18n.t('mapLang.address')} : </b>` + address
      if (addressEdit && addressEdit !== address) {
        message = message + '<br />' + `<b>${i18n.t('mapLang.addressEdit')} : </b>` + addressEdit
      }

      this.infoWindow = new google.maps.InfoWindow({
        content: message,
        size: new google.maps.Size(50, 50)
      })
      this.infoWindow.open(this.map, this.marker)
    }

    // 在地图上显示经纬度地址
    this.attachSecretMessage = (marker, point, address, addressComponents) => {
      let message = null

      if (this.splitCountry) {
        let country = {}
        let province = {}
        let city = {}
        let postalCode = {}
        const addressArr = addressComponents.filter(item => {
          if (item.types.includes('country')) {
            country = { ...item }
            return false
          }
          if (item.types.includes('administrative_area_level_1')) {
            province = { ...item }
            return false
          }
          if (item.types.includes('locality')) {
            city = { ...item }
            return false
          }
          if (item.types.includes('postal_code')) {
            postalCode = { ...item }
            return false
          }
          return true
        })
        const addressData = {
          country: country.long_name,
          province: province.long_name,
          city: city.long_name,
          postalCode: postalCode.long_name,
          address: addressArr.map(item => item.long_name).join(',')
        }
        addressData.province = addressData.province || addressData.city || addressData.country
        addressData.city = addressData.city || addressData.province
        this.mapClick(point.lng(), point.lat(), addressData.address, addressData)

        message = `<b>${i18n.t('mapLang.coordinates')} : </b>` +
          point.lat() + ' , ' + point.lng() +
          '<br />' + `<b>${i18n.t('mapLang.address')} : </b>` + addressData.address
      } else {
        this.mapClick(point.lng(), point.lat(), address)

        message = `<b>${i18n.t('mapLang.coordinates')} : </b>` +
          point.lat() + ' , ' + point.lng() +
          '<br />' + `<b>${i18n.t('mapLang.address')} : </b>` + address
      }
      const google = window.google
      this.infoWindow = new google.maps.InfoWindow({
        content: message,
        size: new google.maps.Size(50, 50)
      })
      this.infoWindow.open(this.map, marker)
    }
    // 删除所有标记阵列中消除对它们的引用
    this.clearOverlays = (infoWindow) => {
      if (this.markersArray && this.markersArray.length > 0) {
        for (let i = 0; i < this.markersArray.length; i++) {
          this.markersArray[i].setMap(null)
        }
        this.markersArray.length = 0
      }
      if (infoWindow) {
        infoWindow.close()
      }
    }

    this.mapClick = (lng, lat, address, addressData) => {
      if (this.backFn) {
        this.backFn({
          lng,
          lat,
          address,
          addressData
        })
      }
    }

    this.setCurrentPosition = (map) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            map.setCenter(pos)
            // new google.maps.Marker({
            //   map: this.map,
            //   position: pos
            // })
          },
          (err) => {
            console.log(err)
          }
        )
      } else {
        // Browser doesn't support Geolocation
        console.log("Browser doesn't support Geolocation")
      }
    }
  }
}

export default MapClass
