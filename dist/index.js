import { defineComponent as H, ref as r, computed as Q, onMounted as W, createElementBlock as l, openBlock as n, createElementVNode as s, withDirectives as y, Fragment as S, renderList as T, toDisplayString as g, vModelSelect as U, createCommentVNode as $, withKeys as C, vModelText as V, normalizeClass as P, normalizeStyle as X, nextTick as R, createVNode as Y } from "vue";
import { useSupabase as Z } from "@y2kfund/core";
const ee = { class: "tasks-box" }, te = { class: "header" }, se = { class: "header-actions" }, oe = ["value"], ae = { class: "tasks-list" }, le = {
  key: 0,
  class: "task-item new-task"
}, ne = { class: "task-content" }, ie = { class: "task-header-row" }, re = ["value"], ue = {
  key: 1,
  class: "empty-state"
}, de = ["onMouseenter"], ce = { class: "task-content" }, ve = {
  key: 0,
  class: "edit-mode"
}, me = { class: "task-header-row" }, pe = ["value"], ye = ["id", "onKeyup"], he = { class: "edit-actions" }, _e = ["onClick"], fe = {
  key: 1,
  class: "view-mode"
}, ke = { class: "task-header-row" }, be = ["title"], we = ["onClick"], ge = ["value", "onChange"], Ce = ["value"], Se = {
  key: 0,
  class: "task-description"
}, Te = {
  key: 2,
  class: "task-actions"
}, xe = ["onClick"], Me = ["onClick"], $e = /* @__PURE__ */ H({
  __name: "Tasks",
  props: {
    symbolRoot: {},
    userId: {}
  },
  setup(h) {
    const d = h, u = Z(), i = r([]), c = r(null), v = r(""), _ = r(""), f = r("medium"), I = r(null), k = r(!1), m = r(""), b = r(""), w = r("medium"), x = r("all"), A = [
      { value: "low", label: "Low", color: "#2196f3" },
      { value: "medium", label: "Medium", color: "#ff9800" },
      { value: "high", label: "High", color: "#f44336" }
    ], q = ["open", "in_progress", "completed", "blocked"], D = Q(() => x.value === "all" ? i.value.filter((o) => !o.archived) : i.value.filter((o) => o.status === x.value && !o.archived)), z = async () => {
      const { data: o, error: e } = await u.schema("hf").from("tasks").select("*").eq("symbol_root", d.symbolRoot).eq("archived", !1).order("created_at", { ascending: !1 });
      !e && o && (i.value = o);
    }, F = async () => {
      k.value = !0, m.value = "", b.value = "", w.value = "medium", await R();
      const o = document.querySelector(".new-task-summary");
      o == null || o.focus();
    }, N = async () => {
      if (!m.value.trim()) {
        k.value = !1;
        return;
      }
      const { data: o, error: e } = await u.schema("hf").from("tasks").insert({
        symbol_root: d.symbolRoot,
        summary: m.value.trim(),
        description: b.value.trim() || null,
        priority: w.value,
        created_by: d.userId,
        status: "open"
      }).select();
      !e && o && (i.value.unshift(o[0]), m.value = "", b.value = "", w.value = "medium", k.value = !1);
    }, E = () => {
      k.value = !1, m.value = "", b.value = "", w.value = "medium";
    }, K = async (o) => {
      c.value = o.id, v.value = o.summary, _.value = o.description || "", f.value = o.priority, await R();
      const e = document.querySelector(`#edit-summary-${o.id}`);
      e == null || e.focus(), e == null || e.select();
    }, O = async (o) => {
      if (!v.value.trim()) {
        M();
        return;
      }
      const { error: e } = await u.schema("hf").from("tasks").update({
        summary: v.value.trim(),
        description: _.value.trim() || null,
        priority: f.value,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", o);
      if (!e) {
        const t = i.value.find((p) => p.id === o);
        t && (t.summary = v.value.trim(), t.description = _.value.trim() || null, t.priority = f.value), c.value = null;
      }
    }, M = () => {
      c.value = null, v.value = "", _.value = "", f.value = "medium";
    }, j = async (o, e) => {
      const { error: t } = await u.schema("hf").from("tasks").update({
        status: e,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", o);
      if (!t) {
        const p = i.value.find((a) => a.id === o);
        p && (p.status = e);
      }
    }, G = async (o) => {
      const { error: e } = await u.schema("hf").from("tasks").update({
        archived: !0,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", o);
      e || (i.value = i.value.filter((t) => t.id !== o));
    }, J = (o) => {
      var e;
      return ((e = A.find((t) => t.value === o)) == null ? void 0 : e.color) || "#999";
    }, B = (o) => o.split("_").map(
      (e) => e.charAt(0).toUpperCase() + e.slice(1)
    ).join(" ");
    return W(() => {
      z();
    }), (o, e) => (n(), l("div", ee, [
      s("div", te, [
        e[10] || (e[10] = s("h3", { class: "box-title" }, "Tasks", -1)),
        s("div", se, [
          y(s("select", {
            "onUpdate:modelValue": e[0] || (e[0] = (t) => x.value = t),
            class: "status-filter"
          }, [
            e[8] || (e[8] = s("option", { value: "all" }, "All Tasks", -1)),
            (n(), l(S, null, T(q, (t) => s("option", {
              key: t,
              value: t
            }, g(B(t)), 9, oe)), 64))
          ], 512), [
            [U, x.value]
          ]),
          s("button", {
            onClick: F,
            class: "add-icon-button",
            title: "Add new task"
          }, [...e[9] || (e[9] = [
            s("svg", {
              width: "20",
              height: "20",
              viewBox: "0 0 20 20",
              fill: "none"
            }, [
              s("path", {
                d: "M10 4V16M4 10H16",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round"
              })
            ], -1)
          ])])
        ])
      ]),
      s("ul", ae, [
        k.value ? (n(), l("li", le, [
          s("div", ne, [
            s("div", ie, [
              y(s("select", {
                "onUpdate:modelValue": e[1] || (e[1] = (t) => w.value = t),
                class: "priority-select new-task-priority"
              }, [
                (n(), l(S, null, T(A, (t) => s("option", {
                  key: t.value,
                  value: t.value
                }, g(t.label), 9, re)), 64))
              ], 512), [
                [U, w.value]
              ]),
              y(s("input", {
                "onUpdate:modelValue": e[2] || (e[2] = (t) => m.value = t),
                onKeyup: [
                  C(N, ["enter"]),
                  C(E, ["esc"])
                ],
                type: "text",
                placeholder: "Task summary...",
                class: "new-task-summary"
              }, null, 544), [
                [V, m.value]
              ])
            ]),
            y(s("textarea", {
              "onUpdate:modelValue": e[3] || (e[3] = (t) => b.value = t),
              onKeyup: C(E, ["esc"]),
              placeholder: "Optional description... (Press Enter on summary or click outside to save)",
              class: "new-task-description",
              rows: "2"
            }, null, 544), [
              [V, b.value]
            ]),
            s("div", { class: "new-task-actions" }, [
              s("button", {
                onClick: N,
                class: "save-btn"
              }, "Save"),
              s("button", {
                onClick: E,
                class: "cancel-btn"
              }, "Cancel")
            ])
          ])
        ])) : $("", !0),
        !k.value && D.value.length === 0 ? (n(), l("li", ue, " No tasks yet. Click the + button to add your first task. ")) : $("", !0),
        (n(!0), l(S, null, T(D.value, (t) => {
          var p;
          return n(), l("li", {
            key: t.id,
            class: P(["task-item", { "task-completed": t.status === "completed" }]),
            onMouseenter: (a) => I.value = t,
            onMouseleave: e[7] || (e[7] = (a) => I.value = null)
          }, [
            s("div", ce, [
              c.value === t.id ? (n(), l("div", ve, [
                s("div", me, [
                  y(s("select", {
                    "onUpdate:modelValue": e[4] || (e[4] = (a) => f.value = a),
                    class: "priority-select"
                  }, [
                    (n(), l(S, null, T(A, (a) => s("option", {
                      key: a.value,
                      value: a.value
                    }, g(a.label), 9, pe)), 64))
                  ], 512), [
                    [U, f.value]
                  ]),
                  y(s("input", {
                    id: `edit-summary-${t.id}`,
                    "onUpdate:modelValue": e[5] || (e[5] = (a) => v.value = a),
                    onKeyup: [
                      C((a) => O(t.id), ["enter"]),
                      C(M, ["esc"])
                    ],
                    type: "text",
                    class: "edit-input"
                  }, null, 40, ye), [
                    [V, v.value]
                  ])
                ]),
                y(s("textarea", {
                  "onUpdate:modelValue": e[6] || (e[6] = (a) => _.value = a),
                  onKeyup: C(M, ["esc"]),
                  placeholder: "Optional description...",
                  class: "edit-description",
                  rows: "2"
                }, null, 544), [
                  [V, _.value]
                ]),
                s("div", he, [
                  s("button", {
                    onClick: (a) => O(t.id),
                    class: "save-btn"
                  }, "Save", 8, _e),
                  s("button", {
                    onClick: M,
                    class: "cancel-btn"
                  }, "Cancel")
                ])
              ])) : (n(), l("div", fe, [
                s("div", ke, [
                  s("span", {
                    class: "priority-badge",
                    style: X({ backgroundColor: J(t.priority) }),
                    title: `Priority: ${t.priority}`
                  }, null, 12, be),
                  s("span", {
                    class: "task-summary",
                    onClick: (a) => K(t)
                  }, g(t.summary), 9, we),
                  s("select", {
                    value: t.status,
                    onChange: (a) => j(t.id, a.target.value),
                    class: P(["status-select", `status-${t.status}`])
                  }, [
                    (n(), l(S, null, T(q, (a) => s("option", {
                      key: a,
                      value: a
                    }, g(B(a)), 9, Ce)), 64))
                  ], 42, ge)
                ]),
                t.description ? (n(), l("p", Se, g(t.description), 1)) : $("", !0)
              ])),
              ((p = I.value) == null ? void 0 : p.id) === t.id && c.value !== t.id ? (n(), l("div", Te, [
                s("button", {
                  onClick: (a) => K(t),
                  class: "action-btn edit-btn",
                  title: "Edit"
                }, [...e[11] || (e[11] = [
                  s("svg", {
                    width: "14",
                    height: "14",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor"
                  }, [
                    s("path", {
                      d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
                      "stroke-width": "2",
                      "stroke-linecap": "round"
                    }),
                    s("path", {
                      d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
                      "stroke-width": "2",
                      "stroke-linecap": "round"
                    })
                  ], -1)
                ])], 8, xe),
                s("button", {
                  onClick: (a) => G(t.id),
                  class: "action-btn archive-btn",
                  title: "Archive"
                }, [...e[12] || (e[12] = [
                  s("svg", {
                    width: "14",
                    height: "14",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor"
                  }, [
                    s("path", {
                      d: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
                      "stroke-width": "2",
                      "stroke-linecap": "round"
                    })
                  ], -1)
                ])], 8, Me)
              ])) : $("", !0)
            ])
          ], 42, de);
        }), 128))
      ])
    ]));
  }
}), L = (h, d) => {
  const u = h.__vccOpts || h;
  for (const [i, c] of d)
    u[i] = c;
  return u;
}, Ve = /* @__PURE__ */ L($e, [["__scopeId", "data-v-3761b4b6"]]), Ie = { class: "tasks-for-single-instrument-view" }, Ae = { class: "boxes-container" }, Ee = /* @__PURE__ */ H({
  __name: "TasksForSingleInstrument",
  props: {
    symbolRoot: { default: "META" },
    userId: { default: "67e578fd-2cf7-48a4-b028-a11a3f89bb9b" }
  },
  setup(h) {
    const d = h;
    return (u, i) => (n(), l("div", Ie, [
      s("div", Ae, [
        Y(Ve, {
          "symbol-root": d.symbolRoot,
          "user-id": d.userId || ""
        }, null, 8, ["symbol-root", "user-id"])
      ])
    ]));
  }
}), De = /* @__PURE__ */ L(Ee, [["__scopeId", "data-v-41d42e22"]]);
export {
  De as TasksForSingleInstrument,
  De as default
};
