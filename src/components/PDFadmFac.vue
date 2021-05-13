<template>
  <v-container>
    <div
      ref="testPDF"
      id="page"
      style="width: 595.28px; color: black; background: white"
    >
      <div class="page page-1">
        <h3>Test page 1</h3>
        <p>This is an page for testing 1</p>
      </div>
      <div class="page page-2">
        <h3>Test page 2</h3>
        <p>This is an page for testing 1</p>
      </div>
      <div class="page page-3">
        <h3>Test page 3</h3>
        <p>This is an page for testing 1</p>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import jsPDF from "jspdf";
import html2PDF from "jspdf-html2canvas";

export default {
  data() {
    return {};
  },

  computed: {
    ...mapState(["test"]),
  },

  watch: {
    test() {
      let page = this.$refs.testPDF;
      console.log(page);
      /*html2PDF(page, {
        jsPDF: {
          format: "a4",
        },
        imageType: "image/jpeg",
        output: "./pdf/generate.pdf",
      });*/
      let pdfName = "test";
      var doc = new jsPDF({
          circle(x=2, y=2, r=2 )
      });
      doc.text("Hello World", 10, 10);
      doc.save(pdfName + ".pdf");
    },
  },

  methods: {},
};
</script>

<style>
</style>