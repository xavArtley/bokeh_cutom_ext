"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ReturnTypeWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ReturnTypeWalker = /** @class */ (function (_super) {
    __extends(ReturnTypeWalker, _super);
    function ReturnTypeWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReturnTypeWalker.prototype.visitMethodDeclaration = function (node) {
        this.checkReturnType(node);
    };
    ReturnTypeWalker.prototype.visitMethodSignature = function (node) {
        this.checkReturnType(node);
    };
    ReturnTypeWalker.prototype.visitGetAccessor = function (node) {
        this.checkReturnType(node);
    };
    ReturnTypeWalker.prototype.checkReturnType = function (node) {
        if (node.type == null) {
            var failure = "expected '" + (node.name == null ? "???" : node.name.getText()) + "' to have an explicit return type";
            this.addFailureAtNode(node, failure);
        }
    };
    return ReturnTypeWalker;
}(Lint.RuleWalker));
