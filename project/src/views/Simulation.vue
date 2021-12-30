<script lang="ts">
import {Component, Vue, Prop } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import * as mqtt from 'mqtt'
import { MqttClient } from "mqtt";
import { 
  SimulationStatus,
  convertStateToViewStatus,
  convertStateToViewAction
} from '../scripts/simulation';

class AssetLists {
  names: string[] = []
}
@Component
export default class extends Vue {
  simStatusView: string = "停止";
  simButtonView: string = "開始";
  simstatus: SimulationStatus = { state: "stopped", simtime: "0.000" };
  asset_lists: string[] = [];
  mqtt_broker_ipaddr: string = '192.168.11.36';
  mqtt_broker_portno: string = '9090';
  topic: string = "mqtt_test"
  mqtt_client?: MqttClient = undefined;
  blob: Blob | null = null;
  imgBlobUrl: string | null = null;
  intervalTimeMsec: number = 1000;
  intervalTimeId?: NodeJS.Timer = undefined;

  
  onControl() {
    if (this.simstatus.state === "stopped") {
      this.onStart();
      this.onUpdate();
    }
    else if (this.simstatus.state === "running") {
      this.onStop();
      this.onReset();
    } else {
      this.onReset();
    }
  }
  onUpdate() {
    //this.getAssetLists();
    if (this.mqtt_client === undefined) {
      this.mqtt_client = mqtt.connect('ws://' + this.mqtt_broker_ipaddr + ':' + this.mqtt_broker_portno + '/mqtt');
      this.mqtt_client.subscribe(this.topic);
      this.mqtt_client.on('message',  (topic, message) => {
          this.blob = new Blob([message])
          this.imgBlobUrl = window.URL.createObjectURL(this.blob)
      });
    }
    if (this.intervalTimeId === undefined) {
      this.intervalTimeId = setInterval(() => { this.timer() }, this.intervalTimeMsec);
    }
  }
  mounted() {
    alert("シミュレーション画面入りました");
    this.onUpdate();
  }
  destroyed () {
    alert("シミュレーション画面から抜けます");
    if (this.intervalTimeId) {
      clearInterval(this.intervalTimeId);
    }
    if (this.mqtt_client) {
      this.mqtt_client.end(true);
      this.mqtt_client = undefined;
    }
  }
  timer() {
    this.getSimStatus();
  }
  async onStart() {
    await this.invokeControl('start');
  }
  async onStop() {
      await this.invokeControl('stop');
  }
  async onReset() {
      await this.invokeControl('reset');
  }
  async invokeControl(control_type: string): Promise<void> {
    const req = { control_type: control_type };
    const res: AxiosResponse = await axios.put("/api/control", req);
    return res.data;
  }
  clearAssets() {
    this.asset_lists = [];
  }
  async getAssetLists() {
    this.clearAssets();
    const assets = await this.invokeGetAssetLists();
    for (var i = 0; i < assets.names.length; i++) {
      const name = assets.names[i];
      this.asset_lists.push(name);
    }
  }
  async invokeGetAssetLists(): Promise<AssetLists> {
    const res: AxiosResponse = await axios.get("/api/assets");
    return res.data;
  }
  getSimStatus() {
    const res = this.invokeGetSimStatus();
  }
  async invokeGetSimStatus(): Promise<void> {
    await axios.get("/api/status").then(res => {
      this.simstatus.state = res.data.status;
      this.simStatusView = convertStateToViewStatus(this.simstatus.state);
      this.simButtonView = convertStateToViewAction(this.simstatus.state);
    });
  }
};


</script>

<template>
  <div class="simulation">
    <h2 :v-model="simStatusView">箱庭シミュレーション({{simStatusView}})</h2>
    <el-row :gutter="20" >
      <el-col :span="16">
        <el-button :v-model="simButtonView" class="sim_button" type="primary" @click="onControl">{{simButtonView}}</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <img v-bind:src="imgBlobUrl" v-if="imgBlobUrl" />
    </el-row>
  </div>
</template>

<style scoped>
  .simulation {
    text-align: left;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>