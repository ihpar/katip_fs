import { Svg, Rect, Path, G } from "@svgdotjs/svg.js";
import { FontLoader } from "./fonts/FontLoader";
import { BravuraFont } from "./fonts/bravura";
import { ColorScheme } from "./Colors";
import Measure from "./Measure";
import MAKAMS from "./Makams";
import { Makam } from "models/Makam";
import USULS from "./Usuls";
import { Usul } from "models/Usul";

export default class Staff {
  index: number;
  top: number;
  width: number;
  painter: Svg;
  symbols: FontLoader;
  colorScheme: ColorScheme;
  rootGroup: G;
  linesGroup: G;
  staffLines: Rect[];
  clef: Path;
  bar: Rect;
  measures: Measure[];
  measureOffset: number;
  defaultMeasureWidth: number;
  defaultMakam: Makam;
  defaultUsul: Usul;

  defaultMeasureCount = 6;
  firstMeasureMargin = 10;
  lineGap = 9;

  constructor(
    index: number,
    width: number,
    painter: Svg,
    colorScheme: ColorScheme,
    defaultMakam: Makam,
    defaultUsul: Usul
  ) {
    this.index = index;
    this.top = index * (16 * this.lineGap) + (6 * this.lineGap);
    this.width = width;
    this.painter = painter;
    this.symbols = new FontLoader(BravuraFont);
    this.colorScheme = colorScheme;
    this.defaultMakam = defaultMakam;
    this.defaultUsul = defaultUsul;
    this.staffLines = [];
    this.measures = [];
    this.measureOffset = Math.floor(this.symbols.getDims("gClef")[0] + this.firstMeasureMargin);
    this.defaultMeasureWidth = Math.round(
      (this.width - this.measureOffset) * 100 / this.defaultMeasureCount
    ) / 100;
    this.rootGroup = this.painter.group();

    this.init();
  }

  init() {
    this.drawStaff();

    for (let i = 0; i < this.defaultMeasureCount; i++) {
      this.measures.push(
        new Measure(
          this.painter,
          i,
          this.defaultMakam,
          this.defaultUsul,
          this.colorScheme,
          this.measureOffset + i * this.defaultMeasureWidth,
          this.top,
          this.defaultMeasureWidth,
          i === 0,
          i === 0,
          i !== this.defaultMeasureCount - 1
        )
      );
    }
  }

  drawStaff() {
    this.linesGroup = this.painter.group();
    // Render staff lines
    for (let i = 0; i < 5; i++) {
      this.linesGroup.rect(this.width, 1).y(i * 9 + this.top);
    }

    // render final bar
    this.linesGroup.rect(1, this.lineGap * 4).move(this.width - 1, this.top);

    // render clef
    this.clef = this.painter.path(this.symbols.getPath("gClef"))
      .center(15, this.top + 18)
      .addClass("main-color");

    this.linesGroup.addClass("staff-line-color");
    this.rootGroup.add(this.linesGroup);
    this.rootGroup.add(this.clef);
  }

  changeColorScheme(colorScheme: ColorScheme) {
    this.colorScheme = colorScheme;

    for (let measure of this.measures) {
      measure.changeColorScheme(colorScheme);
    }
  }
}