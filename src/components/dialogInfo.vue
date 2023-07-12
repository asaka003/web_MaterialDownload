<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    :width="width"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="showClose"
    :lock-scroll="lockScroll"
    :center="center"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :custom-class="customClass"
    :destroy-on-close="destroyOnClose"
    @close="handleClose"
    @open="handleOpen"
  >
    <div v-html="content"></div>
    <template v-if="slot" #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script>
import { ref, defineComponent } from "vue";
import { ElDialog, ElButton } from "element-plus";

export default defineComponent({
  name: "ConfirmDialog",
  components: {
    ElDialog,
    ElButton,
  },
  props: {
    title: {
      type: String,
      default: "确认操作",
    },
    content: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "30%",
    },
    slot: {
      type: Boolean,
      default: false,
    },
    showClose: {
      type: Boolean,
      default: false,
    },
    lockScroll: {
      type: Boolean,
      default: true,
    },
    center: {
      type: Boolean,
      default: true,
    },
    modalAppendToBody: {
      type: Boolean,
      default: true,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    customClass: {
      type: String,
      default: "",
    },
    destroyOnClose: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const visible = ref(false);

    const handleConfirm = () => {
      emit("confirm");
      visible.value = false;
    };

    const handleCancel = () => {
      emit("cancel");
      visible.value = false;
    };

    const handleClose = () => {
      emit("close");
    };

    const handleOpen = () => {
      emit("open");
    };

    const beforeClose = (done) => {
      if (emit("before-close", done)) {
        done();
      }
    };

    const open = () => {
      visible.value = true;
    };

    const close = () => {
      visible.value = false;
    };

    return {
      visible,
      handleConfirm,
      handleCancel,
      handleClose,
      handleOpen,
      beforeClose,
      open,
      close,
    };
  },
});
</script>
