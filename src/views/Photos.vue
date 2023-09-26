<template>
  <v-card flat>
    <v-card-title class="d-flex align-center justify-space-between">
      <h1>Photos</h1>
      <div>
        <v-btn icon="mdi-sync" variant="plain" color="info" @click="loadItems" />
      </div>
    </v-card-title>
    <v-card-text>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items-length="totalItems"
        :items="serverItems"
        :loading="loading"
        dense
        class="elevation-1"
        item-value="name"
        @update:options="loadItems"
      >
        <template v-slot:item.url="{ item }">
          <v-img
              :src="item.selectable.url"
              :lazy-src="item.selectable.thumbnailUrl"
              height="35px" width="35px"
          />
        </template>
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            variant="plain"
            color="grey"
            @click="viewItem(item.selectable.id)"
          />
          <v-btn
            icon="mdi-pencil"
            variant="plain"
            color="warning"
            @click="editItem(item.selectable.id)"
          />
          <v-btn
            icon="mdi-delete"
            variant="plain"
            color="error"
            @click="deleteItem(item.selectable.id)"
          />
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog v-model="dialogs.view" width="35%">
      <v-card>
        <v-card-title> View element with id {{ selectedItem.id }} </v-card-title>
        <v-card-text>
          <v-text-field
            class="ma-0 pa-0"
            variant="outlined"
            readonly
            v-model="selectedItem.id"
            label="#"
            placeholder="id"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            readonly
            v-model="selectedItem.title"
            label="Title"
            placeholder="Title"
          ></v-text-field>
          <div class="w-100 d-flex justify-end">
            <v-img
                :src="selectedItem.url"
                :lazy-src="selectedItem.thumbnailUrl"
                height="150px" width="150px"
                class="my-4"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn class="bg-error" block @click="dialogs.view = false">Close view dialog</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogs.edit" width="35%">
      <v-card>
        <v-card-title> View element with id {{ selectedItem.id }} </v-card-title>
        <v-card-text>
          <v-text-field
            variant="outlined"
            v-model="selectedItem.id"
            label="Id"
            placeholder="Id"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="selectedItem.title"
            label="Title"
            placeholder="Title"
          ></v-text-field>
          <v-text-field
              variant="outlined"
              v-model="selectedItem.url"
              label="New Photo url"
              placeholder="New Photo url"
          ></v-text-field>
          <div class="w-100 d-flex justify-end">
            <v-img
                :src="selectedItem.url"
                :lazy-src="selectedItem.thumbnailUrl"
                height="150px" width="150px"
                class="my-4"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn class="bg-success" block @click="onUpdatePhoto">Update photo</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.model">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="snackbar.model = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { VDataTable } from 'vuetify/labs/VDataTable'

export default {
  components: {
    VDataTable
  },
  data: () => ({
    itemsPerPage: 10,
    headers: [
      {
        title: '#',
        align: 'start',
        sortable: true,
        key: 'id'
      },
      { title: 'title', key: 'title', align: 'start' },
      { title: 'Photo', key: 'url', align: 'start' },
      { title: 'Actions', key: 'actions', align: 'start' }
    ],
    serverItems: [],
    loading: true,
    totalItems: 0,
    snackbar: {
      model: false,
      text: ''
    },
    dialogs: {
      view: false,
      edit: false
    },
    selectedItem: {}
  }),
  methods: {
    loadItems() {
      this.loading = true

      fetch('https://jsonplaceholder.typicode.com/photos')
        .then((response) => response.json())
        .then((items) => {
          console.log(items)
          this.serverItems = items
          this.totalItems = items.length
        })
        .finally(() => {
          this.loading = false
        })
    },
    viewItem(id) {
      const item = this.serverItems.find((item) => item.id === id)
      this.selectedItem = item

      this.dialogs.view = true
    },
    editItem(id) {
      const item = this.serverItems.find((item) => item.id === id)

      this.selectedItem = JSON.parse(JSON.stringify(item))

      this.dialogs.edit = true
    },
    onUpdatePhoto() {
      this.loading = true
      this.dialogs.edit = false
      fetch('https://jsonplaceholder.typicode.com/photos/' + this.selectedItem.id, {
        method: 'PUT',
        body: JSON.stringify(this.selectedItem),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
        .then((response) => response.json())
        .then((json) => {
          const index = this.serverItems.findIndex((todo) => todo.id === this.selectedItem.id)
          this.serverItems[index].id = json.id
          this.serverItems[index].title = json.title
          this.serverItems[index].url = json.url

          this.snackbar.text = `Photo with id ${this.selectedItem.id} successufuly update`
          this.snackbar.model = true
        })
        .catch(() => {
          this.snackbar.text = `Somethings went wrong on update photos with id ${this.selectedItem.id}`
          this.snackbar.model = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteItem(id) {
      this.loading = true
      fetch('https://jsonplaceholder.typicode.com/photos/' + id, {
        method: 'DELETE'
      })
        .then((response) => {
          if (response.status === 200) {
            this.snackbar.text = 'Successufuly removed item ' + id
            this.snackbar.model = true

            this.serverItems = this.serverItems.filter((item) => item.id !== id)
          }
        })
        .catch(() => {
          this.snackbar.text = `Somethings went wrong on delete photos with id ${this.selectedItem.id}`
          this.snackbar.model = true
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
