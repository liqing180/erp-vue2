// import i18n from '@/lang' // 国际化语言包
class MapClass {
  constructor() {
    this.map = null
    this.marker = null
    this.backFn = null
    this.disabled = false

    this.markerLatLng = null
    this.markerText = null
    this.startMarker = {
      marker: null,
      infoWindow: null
    }

    this.latLngList = []
    this.circleRadius = null
    this.circleLatLng = null

    this.polygonStyle = {
      fillColor: '#0094ff',
      fillOpacity: 0.2,
      strokeColor: '#66666',
      strokeOpacity: 0.3,
      strokeWeight: 2
    }
    this.circleStyle = {
      fillColor: '#0094ff',
      fillOpacity: 0.2,
      strokeColor: '#66666',
      strokeOpacity: 0.3,
      strokeWeight: 2
    }

    this.initMap = ({ dom, center, mapTypeId, backFn, disabled, btnWarpDom, inputWarpDom, inputDom, markerLatLng, markerText, latLngList, circleRadius, circleLatLng }) => {
      this.markerLatLng = markerLatLng
      this.markerText = markerText
      this.latLngList = latLngList || []
      this.circleRadius = circleRadius
      this.circleLatLng = circleLatLng
      // 是否将国家省份城市与地址分开
      this.disabled = disabled
      this.backFn = backFn
      const google = window.google
      this.startMarker.infoWindow = new google.maps.InfoWindow()
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
        gestureHandling: 'greedy',
        mapTypeId: mapTypeId || 'roadmap' // 'terrain'
      })
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(btnWarpDom)
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(inputWarpDom)

      const searchBox = new google.maps.places.SearchBox(inputDom)

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces()

        if (places.length === 0) {
          return
        }
        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds()
        const arr = [places[0]]
        arr.forEach((place) => {
          if (!place.geometry) {
            console.log('Returned place contains no geometry')
            return
          }
          // if (place.address_components && place.address_components.length > 0) {
          //   this.marker = new google.maps.Marker({
          //     map: this.map,
          //     title: place.name,
          //     position: place.geometry.location
          //   })
          //   this.markersArray.push(this.marker)

          //   this.attachSecretMessage(this.marker, place.geometry.location, place.formatted_address, place.address_components)
          // } else {
          //   this.placeIdMarker(place.place_id)
          // }

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport)
          } else {
            bounds.extend(place.geometry.location)
          }
        })
        this.map.fitBounds(bounds)
      })

      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            // google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON
            // google.maps.drawing.OverlayType.POLYLINE,
            // google.maps.drawing.OverlayType.RECTANGLE
          ]
        },
        markerOptions: {
          icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        polygonOptions: {
          editable: true,
          zIndex: 1,
          ...this.polygonStyle
        },
        circleOptions: {
          editable: true,
          zIndex: 1,
          ...this.circleStyle

        }
      })
      this.drawingManager.setMap(this.map)

      const bounds = new google.maps.LatLngBounds()
      const list = []
      if (markerLatLng) {
        bounds.extend(markerLatLng)
        this.setStartMarker(markerLatLng)
        list.push(markerLatLng)
      }
      if (circleLatLng) {
        const circleInit = new google.maps.Circle({
          center: this.circleLatLng,
          radius: this.circleRadius
        })
        bounds.union(circleInit.getBounds())
        list.push(circleLatLng)
      }

      if (this.latLngList.length > 0) {
        this.latLngList.forEach(item => {
          list.push(item)
          bounds.extend(item)
        })
      }
      if (circleLatLng) {
        this.map.fitBounds(bounds)
      } else if (list.length > 1) {
        this.map.fitBounds(bounds)
      } else if (markerLatLng) {
        this.map.setCenter(markerLatLng)
      }

      this.setPolygon()
      // this.drawingManager.setDrawingMode(null);

      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          // 处理绘制完成的多边形
          const polygon = event.overlay
          polygon.setMap(null)
          const path = polygon.getPath()
          // 遍历经纬度点列表，获取经纬度坐标
          const coordinates = []
          for (let i = 0; i < path.getLength(); i++) {
            const latLng = path.getAt(i)
            coordinates.push({ lat: latLng.lat(), lng: latLng.lng() })
          }
          this.latLngList = coordinates
          this.changeLatLngList()
          this.setPolygon()
          this.drawingManager.setDrawingMode(null)
        } else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
          console.log(event)
          const circleOverlay = event.overlay
          circleOverlay.setMap(null)
          const latLng = circleOverlay.getCenter()
          this.circleLatLng = { lat: latLng.lat(), lng: latLng.lng() }
          this.circleRadius = circleOverlay.getRadius()
          this.changeLatLngList()
          this.setPolygon()
          this.drawingManager.setDrawingMode(null)
        }
      })
    }

    this.setStartMarker = (position) => {
      const google = window.google
      if (this.startMarker.marker) {
        this.startMarker.marker.setMap(null)
      }
      if (this.startMarker.infoWindow) {
        this.startMarker.infoWindow.setMap(null)
      }
      if (!position) return
      this.startMarker.marker = new google.maps.Marker({
        position,
        map: this.map
      })
      /* 设置信息窗口 */
      // const content = `<b>${i18n.t('mapLang.address')} : </b>` + this.markerText
      const content = this.markerText
      this.startMarker.content = content
      this.setMarkerInfoWindow(this.startMarker)
    }

    this.setMarkerInfoWindow = (markerData) => {
      markerData.infoWindow.setContent(markerData.content)
      markerData.infoWindow.open(this.map, markerData.marker)
      const clickHandler = markerData.marker.addListener('click', () => {
        if (markerData.infoWindow.map) {
          markerData.infoWindow.close()
        } else {
          markerData.infoWindow.setContent(markerData.content)
          markerData.infoWindow.open(this.map, markerData.marker)
        }
      })
      markerData.clickHandler = clickHandler
    }

    this.setPolygon = () => {
      const google = window.google
      if (this.polygon) {
        this.polygon.setMap(null)
      }
      if (this.circle) {
        this.circle.setMap(null)
      }
      if (this.latLngList.length === 0 && !this.circleLatLng && !this.disabled) {
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
      }

      if (this.latLngList.length > 0) {
        this.polygon = new google.maps.Polygon({
          paths: this.latLngList,
          draggable: !this.disabled,
          editable: !this.disabled,
          map: this.map,
          ...this.polygonStyle
        })
        google.maps.event.addListener(this.polygon, 'mouseup', (event) => {
          const path = this.polygon.getPath()
          // 遍历经纬度点列表，获取经纬度坐标
          const coordinates = []
          for (let i = 0; i < path.getLength(); i++) {
            const latLng = path.getAt(i)
            coordinates.push({ lat: latLng.lat(), lng: latLng.lng() })
          }
          // 在这里可以对经纬度点列表进行操作，例如存储、展示等
          this.latLngList = coordinates
          this.changeLatLngList()
        })
        google.maps.event.addListener(this.polygon, 'rightclick', (event) => {
          // 获取右击点的经纬度
          const rightClickLatLng = event.latLng

          // 遍历多边形的路径，找到最近的点
          let nearestIndex = -1
          let nearestDistance = Number.MAX_VALUE
          this.latLngList.forEach((coordinate, index) => {
            const distance = google.maps.geometry.spherical.computeDistanceBetween(rightClickLatLng, coordinate)
            if (distance < nearestDistance) {
              nearestIndex = index
              nearestDistance = distance
            }
          })

          // 如果找到了最近的点，并且路径中有多于3个点，则移除该点
          if (nearestIndex > -1 && this.latLngList.length > 3) {
            this.latLngList.splice(nearestIndex, 1)
            this.polygon.setPaths(this.latLngList)
            this.changeLatLngList()
          }
        })
      }
      if (this.circleLatLng) {
        this.circle = new google.maps.Circle({
          center: this.circleLatLng,
          radius: this.circleRadius,

          map: this.map,
          draggable: !this.disabled,
          editable: !this.disabled,
          crossOnDrag: false,
          ...this.circleStyle
        })
        google.maps.event.addListener(this.circle, 'center_changed', () => {
          const latLng = this.circle.getCenter()
          this.circleLatLng = { lat: latLng.lat(), lng: latLng.lng() }
          this.changeLatLngList()
        })
        google.maps.event.addListener(this.circle, 'radius_changed', () => {
          this.circleRadius = this.circle.getRadius()
          this.changeLatLngList()
        })
      }
    }

    this.drawingNewPolygon = (type) => {
      const google = window.google
      if (this.polygon) {
        this.polygon.setMap(null)
      }
      if (this.circle) {
        this.circle.setMap(null)
      }
      this.latLngList = []
      this.circleLatLng = null
      this.circleRadius = null
      if (type === '1') {
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
      } else if (type === '2') {
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE)
      }
      this.changeLatLngList()
    }
    this.clear = () => {
      if (this.polygon) {
        this.polygon.setMap(null)
      }
      if (this.circle) {
        this.circle.setMap(null)
      }
      this.latLngList = []
      this.circleLatLng = null
      this.circleRadius = null
      this.changeLatLngList()
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
    this.changeLatLngList = () => {
      if (this.backFn) {
        this.backFn({
          latLngList: this.latLngList,
          circleLatLng: this.circleLatLng,
          circleRadius: this.circleRadius
        })
      }
    }
  }
}

export default MapClass
