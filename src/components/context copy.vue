<template>
    <QuillEditor ref="contextQuillEditor"
        id="textareaContent"
        theme="snow"
        v-model:content="MultiSpeakerContent"
        :options="data.editorOption"
        contentType="html"
        @update:content="setValue()"
        @selection-change="onSelectionChange"
    />
</template>

<script setup>
// 局部引入
import { ref, reactive, onMounted } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { toRaw, watch } from 'vue'
import pinyin from "pinyin";

const textareaValue = ref("");
const textareaRange = ref(0);
const textareaSSMLValue = ref("");
const templateSSML = ref(`<speak version="1.0" xml:lang="zh-CN" xmlns="http://www.w3.org/2001/10/synthesis">{content}</speak>`)
const templateMultiSoundWord = ref(`<p phoneme="{sound}">{word}</p>`)
const templateBreak = ref(`<break time="{time}" />`)
const MultiSoundInsertVisible = ref(false)
const BreakInsertVisible = ref(false)
const MultiSpeakerVisible = ref(false)
const MultiWord = ref("")
const MultiWordSound = ref("")
const MiltiWordSoundList = ref([])
const BreakTime = ref(0)

const TextToSSMLMap = new Map()
var count = 0

onMounted(() => {
//   const quill = toRaw(contextQuillEditor.value).getQuill()
//   if (contextQuillEditor.value) {
//     quill.getModule('toolbar')
//   }
});

const props = defineProps(['value'])
const emit = defineEmits(['updateValue'])
const content = ref('')
const contextQuillEditor = ref()
// 通过watch监听回显，笔者这边使用v-model:content 不能正常回显
watch(() => props.value, (val) => {
  toRaw(contextQuillEditor.value).setHTML(val)
}, { deep: true })
const fileBtn = ref()
const data = reactive({
  content: '',
  editorOption: {
    modules: {
      toolbar: []
    },
    placeholder: '请输入配音内容...'
  }
})

//查询文字的所有拼音
const QueryWordPinyin = () =>{
  if(MultiWord.value.length != 1){
    ElMessage.error('请输入单个文字')
    return
  }
  MiltiWordSoundList.value = pinyin(MultiWord.value, {
    heteronym: true,              // 启用多音字模式
  })[0]
}

const onSelectionChange = (Range, oldRange, source) => {
  var range = Range.range
  MultiWord.value = toRaw(contextQuillEditor.value).getText().substring(range.index,range.index+range.length)
  textareaRange.value = range.index
};

const MultiWordInsert = () =>{
  MultiSoundInsertVisible.value = false
  let color = `rgb(255, `+count+`, 0)`
  let insertText = MultiWord.value + `(`+MultiWordSound.value+`)`
  count = count + 1
  TextToSSMLMap.set('<span style="color: '+color+';">'+insertText+'</span>',templateMultiSoundWord.value.replace("{sound}",MultiWordSound.value).replace("{word}",MultiWord.value))
  
  let index = contextQuillEditor.value.getQuill().selection.savedRange.index
  //textareaValue.value = textareaValue.value.substring(0,cursorPosition) + MultiWord + textareaValue.value.substring(cursorPosition)
  contextQuillEditor.value.getQuill().insertText(index, insertText, { color: color})
  contextQuillEditor.value.getQuill().insertEmbed(index+insertText.length, 'image', 'https://fanqie.eralab.cn/assets/split.png');
  //contextQuillEditor.value.getQuill().insertText(index+insertText.length+1, ' ', null)
}

const BreakInsert = () =>{
  BreakInsertVisible.value = false
  let insertText = `{停顿`+BreakTime.value+`秒}`
  TextToSSMLMap.set('<span style="color: blue;">'+insertText+'</span>',templateBreak.value.replace("{time}",BreakTime.value+'s'))

  let index = contextQuillEditor.value.getQuill().selection.savedRange.index
  //textareaValue.value = textareaValue.value.substring(0,cursorPosition) + MultiWord + textareaValue.value.substring(cursorPosition)
  contextQuillEditor.value.getQuill().insertText(index, insertText, { color: 'blue'})
  contextQuillEditor.value.getQuill().insertEmbed(index+insertText.length, 'image', 'https://fanqie.eralab.cn/assets/split.png');
  //contextQuillEditor.value.getQuill().insertText(index+insertText.length+1, ' ', null)
}
</script>
