<template>
  <div class="quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
    <div class="btn_frame">
    <button class="btn" v-on:click="sendArticle()">SendArticle</button>
    </div>
  </div>
</template>

<script>
// require sources
import _Quill from 'quill'
const Quill = window.Quill || _Quill

// import { ImageResize } from 'quill-image-resize-module';
// Quill.register('modules/imageResize', ImageResize);

const endpoint_base = "http://172.105.220.106:7777"

const defaultOptions = {
  theme: 'snow',
  boundary: document.body,
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      // [{ 'header': 1 }, { 'header': 2 }], // header
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      // [{ 'script': 'sub' }, { 'script': 'super' }], // 数式
      // [{ 'indent': '-1' }, { 'indent': '+1' }], // indent
      // [{ 'direction': 'rtl' }],　// 戦闘か最後か
      // [{ 'size': ['small', false, 'large', 'huge'] }], // text size
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      // ['clean'],
      ['link', 'image'] // 'video'外した．
    ],
  },
  placeholder: 'Insert text here ...',
  readOnly: false
}
// pollfill
if (typeof Object.assign != 'function') {
  Object.defineProperty(Object, 'assign', {
    value(target, varArgs) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object')
      }
      const to = Object(target)
      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index]
        if (nextSource != null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    },
    writable: true,
    configurable: true
  })
}
// export
export default {
  name: 'quill-editor',
  data() {
    return {
      title : "title",
      tag : "tag",
      img_url : "img_url",
      _options: {},
      _content: '',
      defaultOptions
    }
  },
  props: {
    content: String,
    value: String,
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      required: false,
      default: () => ({})
    },
    globalOptions: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  mounted() {
    this.initialize()
  },
  beforeDestroy() {
    this.quill = null
    delete this.quill
  },
  methods: {


    sendArticle : function (){
      console.log(this._content)
      this.axios.post(endpoint_base + '/new_article',
          { 
            title : this.title,
            content : this._content,
            tag : this.tag,
            img_url : this.img_url,
          }
      )
      .then(response => {
        console.log(response)
      })  
    },

    // Init Quill instance
    initialize() {
      if (this.$el) {
        // Options
        this._options = Object.assign({}, this.defaultOptions, this.globalOptions, this.options)
        // Instance
        this.quill = new Quill(this.$refs.editor, this._options)

        // this.content = "hoge"
        
        this.quill.enable(false)
        // Set editor content
        if (this.value || this.content) {
          this.quill.pasteHTML(this.value || this.content)
        }
        // Disabled editor
        if (!this.disabled) {
          this.quill.enable(true)
        }
        // Mark model as touched if editor lost focus
        this.quill.on('selection-change', range => {
          if (!range) {
            this.$emit('blur', this.quill)
          } else {
            this.$emit('focus', this.quill)
          }
        })
        // Update model if text changes
        this.quill.on('text-change', (delta, oldDelta, source) => {
          let html = this.$refs.editor.children[0].innerHTML
          const quill = this.quill
          const text = this.quill.getText()
          if (html === '<p><br></p>') html = ''
          this._content = html
          this.$emit('input', this._content)
          this.$emit('change', { html, text, quill })
        })
        // Emit ready event
        this.$emit('ready', this.quill)
      }
    }
  },
  watch: {
    // Watch content change
    content(newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.pasteHTML(newVal)
        } else if(!newVal) {
          this.quill.setText('')
        }
      }
    },
    // Watch content change
    value(newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.pasteHTML(newVal)
        } else if(!newVal) {
          this.quill.setText('')
        }
      }
    },
    // Watch disabled change
    disabled(newVal, oldVal) {
      if (this.quill) {
        this.quill.enable(!newVal)
      }
    }
  }
}
</script>

<style>

* {
    box-sizing: border-box;
}
body {
    margin : 0;
}

.quill-editor{
  /* border : solid 1px; */
  height : 85vh;
}

.btn_frame{
  width : 100px;
  margin : 1px auto 1px auto;
}

.btn {
  border-radius:30px;
	display: block;
	position: relative;
	width: 100px;
	padding: 0.8em;
	text-align: center;
	text-decoration: none;
	color: #fff;
	background-color: rgb(248, 156, 27);
}
.btn:hover {
	 cursor: pointer;
	 text-decoration: none;
   color:#fff;
	background:rgb(248, 147, 6);
}


</style>