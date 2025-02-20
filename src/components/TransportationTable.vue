<template>
  <div>
    <el-table
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      size="default"
    >
      <!-- 展開行 -->
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-table
            :data="row.children"
            style="width: 100%"
            border
            size="default"
          >
            <el-table-column prop="department" label="Department" />
            <el-table-column prop="docKey" label="Doc Key" />
            <el-table-column prop="accNo" label="Account No" />
            <el-table-column prop="accName" label="Account Name" />
            <el-table-column prop="creator" label="Creator" />
          </el-table>
        </template>
      </el-table-column>

      <!-- 主要行 -->
      <el-table-column prop="cgno" label="Purchasing Order Number (CGNO)">
        <template #header>
          <span class="nowrap-text">Purchasing Order Number (CGNO)</span>
        </template>
      </el-table-column>
      <el-table-column prop="zsbh" label="Vendor ID (ZSBH)">
        <template #header>
          <span class="nowrap-text">Vendor ID (ZSBH)</span>
        </template>
      </el-table-column>
      <el-table-column prop="zsm" label="Vendor Name (ZSM)">
        <template #header>
          <span class="nowrap-text">Vendor Name (ZSM)</span>
        </template>
      </el-table-column>

      <!-- 操作欄 -->
      <el-table-column label="Actions">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="addChild(row)"
            >新增子行</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useTransportation } from "@/hooks/useTransportation.js";

// 定義主表的類型
interface Row {
  id: number;
  cgno: string;
  zsbh: string;
  zsm: string;
  hasChildren?: boolean;
  children?: SubRow[];
}

// 定義子表的類型
interface SubRow {
  docKey: string;
  department: string;
  accNo: string;
  accName: string;
  creator: string;
}

// 定義表格數據
const tableData1 = ref<Row[]>([
  {
    id: 1,
    cgno: "CG001",
    zsbh: "ZSB001",
    zsm: "Vendor A",
    hasChildren: true,
    children: [
      {
        department: "Sales",
        docKey: "DK001",
        accNo: "123456",
        accName: "John Doe",
        creator: "Admin",
      },
    ],
  },
  {
    id: 2,
    cgno: "CG002",
    zsbh: "ZSB002",
    zsm: "Vendor B",
    hasChildren: true,
    children: [
      {
        department: "HR",
        docKey: "DK002",
        accNo: "789012",
        accName: "Jane Smith",
        creator: "Manager",
      },
    ],
  },
]);

// 新增子行
const addChild = (row: Row) => {
  if (!row.children) {
    row.children = [];
  }
  row.children.push({
    department: "New Department",
    docKey: `DK00${row.children.length + 1}`,
    accNo: "000000",
    accName: "New User",
    creator: "System",
  });
};
</script>

<style scoped>
/* 讓表頭不換行 */
.nowrap-text {
  white-space: nowrap;
}

/* 確保行的大小一致 */
:deep(.el-table th),
:deep(.el-table td) {
  height: 50px !important;
}
</style>