module.exports = [
"[project]/apps/docs/lib/layout.shared.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "baseOptions",
    ()=>baseOptions,
    "gitConfig",
    ()=>gitConfig
]);
const gitConfig = {
    user: 'fuma-nama',
    repo: 'fumadocs',
    branch: 'main'
};
function baseOptions() {
    return {
        nav: {
            title: 'My App'
        },
        githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`
    };
}
}),
"[project]/apps/docs/app/(home)/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fumadocs$2d$ui$2f$dist$2f$layouts$2f$home$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fumadocs-ui/dist/layouts/home/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$docs$2f$lib$2f$layout$2e$shared$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/docs/lib/layout.shared.tsx [app-rsc] (ecmascript)");
;
;
;
function Layout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fumadocs$2d$ui$2f$dist$2f$layouts$2f$home$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HomeLayout"], {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$docs$2f$lib$2f$layout$2e$shared$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["baseOptions"])(),
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/docs/app/(home)/layout.tsx",
        lineNumber: 5,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=apps_docs_468e0e28._.js.map