<template>
  <v-card flat>
    <v-card-title class="d-flex align-center justify-space-between">
      <h1>Comments</h1>
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
            v-model="selectedItem.name"
            label="Name"
            placeholder=""
          ></v-text-field>
          <v-text-field
            variant="outlined"
            readonly
            v-model="selectedItem.email"
            label="Email"
            placeholder="Email"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            readonly
            v-model="selectedItem.body"
            label="Body"
            placeholder="Body"
          ></v-text-field>
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
            v-model="selectedItem.name"
            label="Name"
            placeholder="Name"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="selectedItem.email"
            label="Email"
            placeholder="Email"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="selectedItem.body"
            label="Body"
            placeholder="Body"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn class="bg-success" block @click="onUpdateTodo">Update comments</v-btn>
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
      { title: 'FirstName', key: 'name', align: 'start' },
      { title: 'Email', key: 'email', align: 'start' },
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

      fetch('https://jsonplaceholder.typicode.com/comments')
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
    onUpdateTodo() {
      this.loading = true
      this.dialogs.edit = false
      fetch('https://jsonplaceholder.typicode.com/comments/' + this.selectedItem.id, {
        method: 'PUT',
        body: JSON.stringify(this.selectedItem),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
        .then((response) => response.json())
        .then((json) => {
          const index = this.serverItems.findIndex((todo) => todo.id === this.selectedItem.id)
          this.serverItems[index].name = json.name
          this.serverItems[index].email = json.email
          this.serverItems[index].body = json.body

          this.snackbar.text = `Comment with id ${this.selectedItem.id} successufuly update`
          this.snackbar.model = true
        })
        .catch(() => {
          this.snackbar.text = `Somethings went wrong on update comments with id ${this.selectedItem.id}`
          this.snackbar.model = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteItem(id) {
      this.loading = true
      fetch('https://jsonplaceholder.typicode.com/comments/' + id, {
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
          this.snackbar.text = `Somethings went wrong on delete comments with id ${this.selectedItem.id}`
          this.snackbar.model = true
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
