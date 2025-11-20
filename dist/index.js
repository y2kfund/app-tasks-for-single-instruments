import { defineComponent as F, ref as r, computed as Y, onMounted as Z, createElementBlock as l, openBlock as n, createElementVNode as s, withDirectives as h, Fragment as S, renderList as T, toDisplayString as v, vModelSelect as E, createCommentVNode as x, withKeys as C, vModelText as U, normalizeClass as R, normalizeStyle as ee, createTextVNode as H, nextTick as z, createVNode as te } from "vue";
import { useSupabase as se } from "@y2kfund/core";
const oe = { class: "tasks-box" }, ae = { class: "header" }, le = { class: "header-actions" }, ne = ["value"], ie = { class: "tasks-list" }, re = {
  key: 0,
  class: "task-item new-task"
}, ue = { class: "task-content" }, de = { class: "task-header-row" }, ce = ["value"], ve = {
  key: 1,
  class: "empty-state"
}, me = ["onMouseenter"], pe = { class: "task-content" }, ye = {
  key: 0,
  class: "edit-mode"
}, he = { class: "task-header-row" }, fe = ["value"], _e = ["id", "onKeyup"], ke = { class: "edit-actions" }, be = ["onClick"], we = {
  key: 1,
  class: "view-mode"
}, ge = { class: "task-header-row" }, Ce = ["title"], Se = ["onClick"], Te = ["value", "onChange"], xe = ["value"], Me = {
  key: 0,
  class: "task-description"
}, Ve = {
  key: 2,
  class: "task-actions"
}, $e = ["onClick"], De = ["onClick"], Ue = {
  key: 3,
  class: "tooltip"
}, Ie = /* @__PURE__ */ F({
  __name: "Tasks",
  props: {
    symbolRoot: {},
    userId: {}
  },
  setup(f) {
    const d = f, u = se(), i = r([]), c = r(null), m = r(""), _ = r(""), k = r("medium"), M = r(null), b = r(!1), p = r(""), w = r(""), g = r("medium"), V = r("all"), I = [
      { value: "low", label: "Low", color: "#2196f3" },
      { value: "medium", label: "Medium", color: "#ff9800" },
      { value: "high", label: "High", color: "#f44336" }
    ], N = ["open", "in_progress", "completed", "blocked"], q = Y(() => V.value === "all" ? i.value.filter((o) => !o.archived) : i.value.filter((o) => o.status === V.value && !o.archived)), G = async () => {
      const { data: o, error: e } = await u.schema("hf").from("tasks").select("*").eq("symbol_root", d.symbolRoot).eq("archived", !1).order("created_at", { ascending: !1 });
      !e && o && (i.value = o);
    }, J = async () => {
      b.value = !0, p.value = "", w.value = "", g.value = "medium", await z();
      const o = document.querySelector(".new-task-summary");
      o == null || o.focus();
    }, K = async () => {
      if (!p.value.trim()) {
        b.value = !1;
        return;
      }
      const { data: o, error: e } = await u.schema("hf").from("tasks").insert({
        symbol_root: d.symbolRoot,
        summary: p.value.trim(),
        description: w.value.trim() || null,
        priority: g.value,
        created_by: d.userId,
        status: "open"
      }).select();
      !e && o && (i.value.unshift(o[0]), p.value = "", w.value = "", g.value = "medium", b.value = !1);
    }, A = () => {
      b.value = !1, p.value = "", w.value = "", g.value = "medium";
    }, O = async (o) => {
      c.value = o.id, m.value = o.summary, _.value = o.description || "", k.value = o.priority, await z();
      const e = document.querySelector(`#edit-summary-${o.id}`);
      e == null || e.focus(), e == null || e.select();
    }, B = async (o) => {
      if (!m.value.trim()) {
        $();
        return;
      }
      const { error: e } = await u.schema("hf").from("tasks").update({
        summary: m.value.trim(),
        description: _.value.trim() || null,
        priority: k.value,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", o);
      if (!e) {
        const t = i.value.find((y) => y.id === o);
        t && (t.summary = m.value.trim(), t.description = _.value.trim() || null, t.priority = k.value), c.value = null;
      }
    }, $ = () => {
      c.value = null, m.value = "", _.value = "", k.value = "medium";
    }, Q = async (o, e) => {
      const { error: t } = await u.schema("hf").from("tasks").update({
        status: e,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", o);
      if (!t) {
        const y = i.value.find((D) => D.id === o);
        y && (y.status = e);
      }
    }, W = async (o) => {
      const { error: e } = await u.schema("hf").from("tasks").update({
        archived: !0,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", o);
      e || (i.value = i.value.filter((t) => t.id !== o));
    }, X = (o) => {
      var e;
      return ((e = I.find((t) => t.value === o)) == null ? void 0 : e.color) || "#999";
    }, L = (o) => o.split("_").map(
      (e) => e.charAt(0).toUpperCase() + e.slice(1)
    ).join(" "), P = (o) => new Date(o).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    return Z(() => {
      G();
    }), (o, e) => (n(), l("div", oe, [
      s("div", ae, [
        e[10] || (e[10] = s("h3", { class: "box-title" }, "Tasks", -1)),
        s("div", le, [
          h(s("select", {
            "onUpdate:modelValue": e[0] || (e[0] = (t) => V.value = t),
            class: "status-filter"
          }, [
            e[8] || (e[8] = s("option", { value: "all" }, "All Tasks", -1)),
            (n(), l(S, null, T(N, (t) => s("option", {
              key: t,
              value: t
            }, v(L(t)), 9, ne)), 64))
          ], 512), [
            [E, V.value]
          ]),
          s("button", {
            onClick: J,
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
      s("ul", ie, [
        b.value ? (n(), l("li", re, [
          s("div", ue, [
            s("div", de, [
              h(s("select", {
                "onUpdate:modelValue": e[1] || (e[1] = (t) => g.value = t),
                class: "priority-select new-task-priority"
              }, [
                (n(), l(S, null, T(I, (t) => s("option", {
                  key: t.value,
                  value: t.value
                }, v(t.label), 9, ce)), 64))
              ], 512), [
                [E, g.value]
              ]),
              h(s("input", {
                "onUpdate:modelValue": e[2] || (e[2] = (t) => p.value = t),
                onKeyup: [
                  C(K, ["enter"]),
                  C(A, ["esc"])
                ],
                type: "text",
                placeholder: "Task summary...",
                class: "new-task-summary"
              }, null, 544), [
                [U, p.value]
              ])
            ]),
            h(s("textarea", {
              "onUpdate:modelValue": e[3] || (e[3] = (t) => w.value = t),
              onKeyup: C(A, ["esc"]),
              placeholder: "Optional description... (Press Enter on summary or click outside to save)",
              class: "new-task-description",
              rows: "2"
            }, null, 544), [
              [U, w.value]
            ]),
            s("div", { class: "new-task-actions" }, [
              s("button", {
                onClick: K,
                class: "save-btn"
              }, "Save"),
              s("button", {
                onClick: A,
                class: "cancel-btn"
              }, "Cancel")
            ])
          ])
        ])) : x("", !0),
        !b.value && q.value.length === 0 ? (n(), l("li", ve, " No tasks yet. Click the + button to add your first task. ")) : x("", !0),
        (n(!0), l(S, null, T(q.value, (t) => {
          var y, D;
          return n(), l("li", {
            key: t.id,
            class: R(["task-item", { "task-completed": t.status === "completed" }]),
            onMouseenter: (a) => M.value = t,
            onMouseleave: e[7] || (e[7] = (a) => M.value = null)
          }, [
            s("div", pe, [
              c.value === t.id ? (n(), l("div", ye, [
                s("div", he, [
                  h(s("select", {
                    "onUpdate:modelValue": e[4] || (e[4] = (a) => k.value = a),
                    class: "priority-select"
                  }, [
                    (n(), l(S, null, T(I, (a) => s("option", {
                      key: a.value,
                      value: a.value
                    }, v(a.label), 9, fe)), 64))
                  ], 512), [
                    [E, k.value]
                  ]),
                  h(s("input", {
                    id: `edit-summary-${t.id}`,
                    "onUpdate:modelValue": e[5] || (e[5] = (a) => m.value = a),
                    onKeyup: [
                      C((a) => B(t.id), ["enter"]),
                      C($, ["esc"])
                    ],
                    type: "text",
                    class: "edit-input"
                  }, null, 40, _e), [
                    [U, m.value]
                  ])
                ]),
                h(s("textarea", {
                  "onUpdate:modelValue": e[6] || (e[6] = (a) => _.value = a),
                  onKeyup: C($, ["esc"]),
                  placeholder: "Optional description...",
                  class: "edit-description",
                  rows: "2"
                }, null, 544), [
                  [U, _.value]
                ]),
                s("div", ke, [
                  s("button", {
                    onClick: (a) => B(t.id),
                    class: "save-btn"
                  }, "Save", 8, be),
                  s("button", {
                    onClick: $,
                    class: "cancel-btn"
                  }, "Cancel")
                ])
              ])) : (n(), l("div", we, [
                s("div", ge, [
                  s("span", {
                    class: "priority-badge",
                    style: ee({ backgroundColor: X(t.priority) }),
                    title: `Priority: ${t.priority}`
                  }, null, 12, Ce),
                  s("span", {
                    class: "task-summary",
                    onClick: (a) => O(t)
                  }, v(t.summary), 9, Se),
                  s("select", {
                    value: t.status,
                    onChange: (a) => Q(t.id, a.target.value),
                    class: R(["status-select", `status-${t.status}`])
                  }, [
                    (n(), l(S, null, T(N, (a) => s("option", {
                      key: a,
                      value: a
                    }, v(L(a)), 9, xe)), 64))
                  ], 42, Te)
                ]),
                t.description ? (n(), l("p", Me, v(t.description), 1)) : x("", !0)
              ])),
              ((y = M.value) == null ? void 0 : y.id) === t.id && c.value !== t.id ? (n(), l("div", Ve, [
                s("button", {
                  onClick: (a) => O(t),
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
                ])], 8, $e),
                s("button", {
                  onClick: (a) => W(t.id),
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
                ])], 8, De)
              ])) : x("", !0),
              ((D = M.value) == null ? void 0 : D.id) === t.id && c.value !== t.id ? (n(), l("div", Ue, [
                H(" Created: " + v(P(t.created_at)), 1),
                e[13] || (e[13] = s("br", null, null, -1)),
                H(" Updated: " + v(P(t.updated_at)), 1)
              ])) : x("", !0)
            ])
          ], 42, me);
        }), 128))
      ])
    ]));
  }
}), j = (f, d) => {
  const u = f.__vccOpts || f;
  for (const [i, c] of d)
    u[i] = c;
  return u;
}, Ae = /* @__PURE__ */ j(Ie, [["__scopeId", "data-v-a4ff9724"]]), Ee = { class: "tasks-for-single-instrument-view" }, Ne = { class: "boxes-container" }, qe = /* @__PURE__ */ F({
  __name: "TasksForSingleInstrument",
  props: {
    symbolRoot: { default: "META" },
    userId: { default: "67e578fd-2cf7-48a4-b028-a11a3f89bb9b" }
  },
  setup(f) {
    const d = f;
    return (u, i) => (n(), l("div", Ee, [
      s("div", Ne, [
        te(Ae, {
          "symbol-root": d.symbolRoot,
          "user-id": d.userId || ""
        }, null, 8, ["symbol-root", "user-id"])
      ])
    ]));
  }
}), Be = /* @__PURE__ */ j(qe, [["__scopeId", "data-v-41d42e22"]]);
export {
  Be as TasksForSingleInstrument,
  Be as default
};
