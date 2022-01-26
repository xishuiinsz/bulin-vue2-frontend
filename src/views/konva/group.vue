<template>
  <div class="konva-canvas-container">
    <h3>konva.js实现组合、解除组合功能</h3>
    <el-row class="btn-group">
      <el-button @click="groupShape" type="primary">组合</el-button>
      <el-button @click="ungroupShape" type="primary">解除组合</el-button>
    </el-row>
    <div class="konva-group-content">
      <div id="konva-canvas-container"></div>
    </div>
  </div>
</template>

<script>
import Konva from "konva";
export default {
  name: "konvaGroupUngroup",
  components: {},
  mounted() {
    this.initStage();
    this.initlayer();
    this.drawShape()
  },
  methods: {
    // 初始化konva stage
    initStage() {
      const konvaGroupContainer = this.$el.querySelector(
        "#konva-canvas-container"
      );
      const width = konvaGroupContainer.offsetWidth;
      const height = konvaGroupContainer.offsetHeight;
      this.stage = new Konva.Stage({
        container: "konva-canvas-container",
        width,
        height,
      });
      this.stage.on('click', function(evt) {
        console.log(evt);
      })
    },
    // 初始化Konva.js this.layer
    initlayer() {
      this.layer = new Konva.Layer();
      this.stage.add(this.layer);
    },
    // 绘制图形
    drawShape() {
      var rect1 = new Konva.Rect({
        x: 60,
        y: 60,
        width: 100,
        height: 90,
        fill: "red",
        name: "rect",
        draggable: true,
      });
      this.layer.add(rect1);

      var rect2 = new Konva.Rect({
        x: 250,
        y: 100,
        width: 150,
        height: 90,
        fill: "green",
        name: "rect",
        draggable: true,
      });
      this.layer.add(rect2);

      var tr = new Konva.Transformer();
      this.tr = tr
      this.layer.add(tr);

      // by default select all shapes
      tr.nodes([rect1, rect2]);

      // add a new feature, lets add ability to draw selection rectangle
      var selectionRectangle = new Konva.Rect({
        fill: "rgba(0,0,255,0.5)",
        visible: false,
      });
      this.layer.add(selectionRectangle);
      const _this = this
      var x1, y1, x2, y2;
      this.stage.on("mousedown touchstart", (e) => {
        // do nothing if we mousedown on any shape
        if (e.target !== _this.stage) {
          return;
        }
        e.evt.preventDefault();
        x1 = _this.stage.getPointerPosition().x;
        y1 = _this.stage.getPointerPosition().y;
        x2 = _this.stage.getPointerPosition().x;
        y2 = _this.stage.getPointerPosition().y;

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
      });

      this.stage.on("mousemove touchmove", (e) => {
        // do nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        e.evt.preventDefault();
        x2 = _this.stage.getPointerPosition().x;
        y2 = _this.stage.getPointerPosition().y;

        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
      });

      this.stage.on("mouseup touchend", (e) => {
        // do nothing if we didn't start selection
        if (!selectionRectangle.visible()) {
          return;
        }
        e.evt.preventDefault();
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
        });

        var shapes = _this.stage.find(".rect");
        var box = selectionRectangle.getClientRect();
        var selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        tr.nodes(selected);
      });

      // clicks should select/deselect shapes
      this.stage.on("click tap", function (e) {
        // if we are selecting with rect, do nothing
        if (selectionRectangle.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (e.target === _this.stage) {
          tr.nodes([]);
          return;
        }

        // do nothing if clicked NOT on our rectangles
        if (!e.target.hasName("rect")) {
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr.nodes().concat([e.target]);
          tr.nodes(nodes);
        }
      });
    },
    // 组合 
    groupShape() {
      if(this.tr.nodes().length < 2) {
        this. $message.error('至少需要2个图形才能组合！')
        return
      }
      const group = new Konva.Group({ });
      const nodes = this.tr.nodes()
      group.add(...nodes);
      this.layer.add(group)
    },
    // 解除组合 
    ungroupShape() {
      console.log(this.stage);
    }
  },
};
</script>

<style lang="scss" scoped>
.konva-canvas-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .btn-group {
    padding: 16px 0;
  }
  .konva-group-content {
    flex: 1;
    #konva-canvas-container {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
