<template>
  <div id="DemoPage">
    <div class="title">
      <img src="../assets/water.png" alt="water" class="icon" />
      <h1>Water</h1>
    </div>
    <ry-edit-table
      ref="ryEditTable"
      :listData="listData"
      :listConfig="listConfig"
      :rowButtons="rowButtons"
      :operationsConfig="{ width: 173 }"
      :action="'action'"
      :cellStyle="{ color: 'orange' }"
      :cellClassName="'custom-cell-class'"
      trigger="onChange"
    >
      <el-table-column type="selection" width="55px" fixed="left" />
      <el-table-column type="index" label="Index" width="100px" fixed="left" />
    </ry-edit-table>
  </div>
</template>

<script>
export default {
  name: "demoPage",

  data() {
    return {
      dropDownOptions: {
        job: [],
      },
      list: [
        {
          name: "Time1",
          age: "26",
          pkid: 1,
          date: "1998-01-30",
          job: "0",
          job$view: "Athlete",
          items$view: "Badminton, Swimming",
          items: ["0", "3"],
        },
        {
          name: "cherry",
          age: "13",
          pkid: 2,
          date: "1996-01-30",
          job: "2",
          job$view: "Student",
          items$view: "Badminton, Swimming",
          items: ["0", "3"],
        },
        {
          name: "alex",
          age: "28",
          pkid: 3,
          date: "1992-01-30",
          job: "0",
          job$view: "Athlete",
          items$view: "Badminton, Swimming",
          items: ["0", "3"],
        },
      ],
      listData: [],
      listConfig: [
        {
          mode: "text",
          label: "Name",
          prop: "name",
          minWidth: "150px",
          disabled(row) {
            return row.name === "cherry";
          },
          change: (v, row, index) => {
            console.log("v, row, index: ", v, row, index);
          },
          blur: (v) => {
            console.log("name blur");
          },
          rules: [
            {
              type: "string",
              required: true,
              message: "Name cannot be empty",
            },
          ],
        },
        {
          mode: "text",
          label: "Age",
          prop: "age",
          minWidth: "100px",
          sortable: true,
          change: (v, row) => (row.job = v <= 22 ? "2" : ""),
          rules: [
            {
              type: "number",
              asyncValidator: (rule, value) => {
                return new Promise((resolve, reject) => {
                  if (value < 1) {
                    reject("Age must be greater than 1");
                  } else {
                    resolve();
                  }
                });
              },
            },
          ],
        },
        {
          mode: "date",
          label: "Date of Birth",
          prop: "date",
          minWidth: "180px",
          inputConfig: {
            "value-format": "YYYY-MM-DD",
          },
          rules: [
            {
              type: "date",
              required: true,
              message: "Date of Birth cannot be empty",
            },
          ],
        },
        {
          mode: "select",
          label: "Occupation/Status",
          prop: "job",
          renderProp: "job$view",
          minWidth: "100px",
          placeholder: "Please select",
          inputConfig: {
            clearable: true,
          },
          options: (row) => {
            return row.age > 22
              ? this.dropDownOptions.job.filter((item) => item.value !== "2")
              : this.dropDownOptions.job.filter((item) => item.value === "2");
          },
          rules: [
            {
              required: true,
              message: "Occupation/Status cannot be empty",
            },
          ],
        },
        {
          mode: "select",
          label: "Competition Events",
          minWidth: "300px",
          prop: "items",
          renderProp: "items$view",
          placeholder: "Multiple choices",
          inputConfig: {
            clearable: true,
            multiple: true,
          },
          options: [
            { value: "0", label: "Badminton" },
            { value: "1", label: "Basketball" },
            { value: "2", label: "Table Tennis" },
            { value: "3", label: "Swimming" },
          ],
          rules: [
            {
              required: true,
              message: "Competition event cannot be empty",
            },
          ],
        },
      ],
      rowButtons: [
        {
          name: "Edit",
          type: "primary",
          vIf: (row) => !row.isEdit,
          click: (ref) => {
            ref.edit();
          },
        },
        {
          name: "Save",
          type: "success",
          vIf: (row) => row.isEdit,
          click: (ref, row) => {
            ref.validate((valid) => {
              if (valid) {
                ref.cancel();
              }
            });
          },
        },
        {
          name: "Cancel",
          type: "danger",
          vIf: (row) => row.isEdit,
          click: (ref) => {
            ref.cancel();
          },
        },
        {
          name: "Delete",
          type: "danger",
          vIf: (row) => !row.isEdit,
          click: (ref) => {
            ref.delete();
          },
        },
      ],
    };
  },
  created() {
    this.getDropDownOptions();
    this.getList();
  },
  methods: {
    getList() {
      setTimeout(() => {
        this.listData = [...this.list];
      }, 1000);
    },
    async getDropDownOptions() {
      this.dropDownOptions.job = await Promise.resolve([
        { label: "Athlete", value: "0" },
        { label: "Engineer", value: "1" },
        { label: "Student", value: "2" },
      ]);
    },
  },
};
</script>

<style scoped>
.title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(61, 243, 243, 0.973);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  justify-content: center;
  padding: 20px;
}
.icon {
  width: 140px;
}
</style>
