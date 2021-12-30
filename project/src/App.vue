<template>
  <div id="app">
    <el-container>
      <el-header >
        <el-menu  mode="horizontal" id="nav">
          <el-menu-item>
            <router-link to="/">Home</router-link>
          </el-menu-item>
          <el-menu-item>
            <router-link to="/simulation">Simulation</router-link>
          </el-menu-item>          
          <el-menu-item>
            <router-link to="/about">About</router-link>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>