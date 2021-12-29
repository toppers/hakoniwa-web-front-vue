<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import { component } from "vue/types/umd";
import Vuetify from 'vuetify';
import * as mqtt from 'mqtt'
import { MqttClient } from "mqtt";

class AssetLists {
  names: string[] = []
}
class SimulationStatus {
  status: string = "stopped"
}

@Component
export default class extends Vue {
  control_cmd: string = "開始";
  asset_lists: string[] = [];
  simstatus: SimulationStatus = { status: "stopped" };
  mqtt_broker_ipaddr: string = '192.168.11.36';
  mqtt_broker_portno: string = '9090';
  topic: string = "mqtt_test"
  mqtt_client: MqttClient = mqtt.connect('ws://' + this.mqtt_broker_ipaddr + ':' + this.mqtt_broker_portno + '/mqtt');
  blob: Blob | null = null;
  imgBlobUrl: string | null = null;

  mqtt_on_connect() {
    console.log('mqtt connect!!')
  }

  onControl() {
    var before_stat = this.simstatus;
    if (this.control_cmd === "開始") {
      this.onStart();
      this.control_cmd = "停止";
    }
    else if (this.control_cmd === "停止") {
      this.onStop();
      this.control_cmd = "リセット";
    }
    else if (this.control_cmd === "リセット") {
      this.onReset();
      this.control_cmd = "開始";
    }
  }
  onUpdate() {
    this.getAssetLists();
    this.getSimStatus();
    this.mqtt_client.subscribe(this.topic);

    this.mqtt_client.on('message',  (topic, message) => {
      this.blob = new Blob([message])
      this.imgBlobUrl = window.URL.createObjectURL(this.blob)
    });
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
      this.simstatus.status = res.data.status;
    });
  }
};

</script>

<template>
  <div class="simulation">
    <h2 :v-model="simstatus">箱庭シミュレーション({{simstatus.status}})</h2>

    <el-row type="flex">
      <el-col>
        <el-button class="sim_button" type="primary" @click="onControl">{{control_cmd}}</el-button>
      </el-col>
      <el-col>
        <el-button class="sim_button" type="primary" @click="onUpdate">更新</el-button>
      </el-col>
      <el-col>
        <span>アセット一覧</span>
        <ul>
          <li v-for="asset_name in asset_lists" :key="asset_name">
            {{ asset_name }}
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row>
      <img v-bind:src="imgBlobUrl" v-if="imgBlobUrl" />
    </el-row>
  </div>
</template>

<style scoped>
.translator {
  text-align: left;
}
.sim_button {
    width: 50%;
    min-width: 100px;
    max-width: 200px;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #68779a;
    background: #cbe8fa;
    cursor: pointer;
}
</style>