<script lang="ts">
import Vue from "vue";
import axios, { AxiosResponse } from "axios";

// フォームデータ
class FormData {
  inputText: string = "";
}

// ビューモデル
export default Vue.extend({
  data() {
    return {
      target: new FormData()
    };
  },
  methods: {
    // 翻訳ボタンクリック時のイベントハンドラ
    async onSubmit() {
      if (this.target.inputText) {
        const translatorResult = await this.invokeTranslator(this.target.inputText);
      }
    },

    async invokeTranslator(text: string): Promise<void> {
      const modify = { control_type: 'start' };
      const res: AxiosResponse = await axios.put("/api/control", modify);
      return res.data;
    }
  }
});
</script>

<template>
  <div class="simulation">
    <h2>箱庭コマンドの実行</h2>
    <el-row :gutter="40">
      <el-col :span="12">
        <el-form ref="form" :model="target">
          <el-form-item label="コマンド引数">
            <el-input
              type="textarea"
              rows="8"
              v-model="target.inputText"
              placeholder="コマンド引数を入力してください"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">送信</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <span>コマンド実行結果</span>
        <ul>
          <li> </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.translator {
  text-align: left;
}
</style>