<template>
  <router-view v-if="$route.path === '/auth'" />
  <v-layout v-else class="rounded rounded-md">
    <v-navigation-drawer
      :class="$vuetify.theme.global.name === 'light' ? 'bg-deep-purple' : ''"
      :theme="$vuetify.theme.global.name === 'light' ? 'dark' : ''"
      permanent
    >
      <v-list nav density="compact" color="primary">
        <v-list-item
          v-for="(item, i) in navigations"
          :key="i"
          :to="{ path: item.href }"
          color="primary"

          >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>

          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            :theme="$vuetify.theme.global.name === 'light' ? 'dark' : 'light'"
            @click="logout"
          >
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar flat title="Application bar">
      <v-btn icon="mdi-theme-light-dark" variant="plain" @click="toggleTheme" />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    navigations: [
      { text: 'Dashboard', href: '/', icon: 'mdi-home' },
      { text: 'Comments', href: '/comments', icon: 'mdi-comment-text-multiple' },
      { text: 'Albums', href: '/albums', icon: 'mdi-image-album' },
      { text: 'Photos', href: '/photos', icon: 'mdi-camera' },
      { text: 'Users', href: '/users', icon: 'mdi-card-account-details' },
      { text: 'Shared', href: '/auth', icon: 'mdi-account' }
    ]
  }),
  methods: {
    logout() {
      localStorage.clear()
      this.$router.push({ path: '/auth' })
    },
    toggleTheme() {
      this.$vuetify.theme.global.name = this.$vuetify.theme.global.current.dark ? 'light' : 'dark'
    }
  }
}
</script>
