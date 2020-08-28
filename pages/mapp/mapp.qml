<view class="map_container">
  <view class="map-tab-bar">
    <view class="map-tab-li {{item.id == status ? 'active' : ''}}" bindtap="getType" data-type="{{item.id}}" qq:key="aroundListId" qq:for="{{aroundList}}">{{item.name}}</view>
    <view >
        <button type="primary" open-type="openSetting" qq:if="{{showbtn}}">重新授权使用地理位置</button>
        <button qq:else></button>
    </view>
    <!-- <view ></view> -->
  </view>
  <map class="map" longitude="{{longitude}}" latitude="{{latitude}}" include-points="{{points}}" markers='{{markers}}'>
      <cover-view class="data" qq:if="{{markers}}" qq:for="{{forrn}}">
        <cover-view class="title">{{item.name}}</cover-view>
        <cover-view class="detail">{{item.typename}}</cover-view>
        <cover-view class="detail">{{item.adres}}</cover-view>
        <cover-view class="detail">距我{{item.juli}}米</cover-view>
        <cover-image bindtap="ongotap" src="/images/map.png"></cover-image>
    </cover-view>
  </map>

  <cover-view class="btn">
    <button bindtap="bindMark" class="btn-item">选择一个</button>
     <button class="btn-item" openType="share" qq:if="{{btmshow}}">召唤朋友</button>
     <button bindtap="onsharetap" class="btn-item" qq:else>召唤朋友</button>
  </cover-view>

  <!-- <view class="map-tab-bar map-foot {{isShow ? '' : 'map-hide'}}">
     <view class="map-name">{{name}}</view> 
  </view> -->
</view>