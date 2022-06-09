// 创建一个新的 store 实例
import {createStore} from "vuex";
import {layer} from "@layui/layer-vue";
import {formatToHump, titleCase} from "../util/stringUtil";
import {getProject} from "../api/api";

export const store = createStore({
    state () {
        return {
            baseParams: {},
            databases: [],
            tables: [],
            chooseTables: [],
            ftls: [],
            projects: [],
            project: null,
            activeStep: 1,
            treeData: [],
            preview: true,
        }
    },
    getters: {
        baseParams (state, getters) {
            // @ts-ignore
            return state.baseParams;
        },
        databases (state, getters) {
            // @ts-ignore
            return state.databases;
        },
        tables (state, getters) {
            // @ts-ignore
            return state.tables;
        },
        chooseTables (state, getters) {
            // @ts-ignore
            return state.chooseTables;
        },
        ftls (state, getters) {
            // @ts-ignore
            return state.ftls;
        },
        projects (state, getters) {
            // @ts-ignore
            return state.projects;
        },
        project (state, getters) {
            // @ts-ignore
            return state.project;
        },
        treeData (state, getters) {
            // @ts-ignore
            return state.treeData;
        },
        preview (state, getters) {
            // @ts-ignore
            return state.preview;
        },
        getDatabaseById: (state) => (id) => {
            if (id) {
                // @ts-ignore
                return state.databases.find(database => {
                    return database.id === id
                });
            } else {
                return null;
            }
        }
    },
    mutations: {
        refreshBaseParams (state, options) {
            for (var key in options) {
                // @ts-ignore
                state.baseParams[key] = options[key];
            }
            // @ts-ignore

            if (!state.baseParams['projectName']) {
                // @ts-ignore
                state.baseParams['projectName'] = "";
            }

            // @ts-ignore
            if (state.project != null) {
                // @ts-ignore
                state.project.name = state.baseParams['projectName'];
            }
        },
        addDatabase (state, database) {
            // @ts-ignore
            state.databases.push(database);
        },
        saveDatabase (state, database) {
            // @ts-ignore
            let databaseOld = store.getters.getDatabaseById(database.id);
            if (databaseOld) {
                for(var key in database) {
                    databaseOld[key] = database[key]
                }
                layer.msg("保存数据库配置成功", { icon : 1, time: 1000})
            } else {
                layer.msg("数据库配置不存在，保存失败", { icon : 2, time: 1500})
            }
        },
        deleteDatabase (state, database) {
            // @ts-ignore
            for (var i =0; i< state.databases.length;i++) {
                // @ts-ignore
                if (database.id === state.databases[i].id) {
                    // @ts-ignore
                    state.databases.splice(i, 1);
                }
            }
        },
        refreshTables (state, tables) {
            // @ts-ignore
            state.tables = [];
            for (var table of tables) {
                // @ts-ignore
                state.tables.push(table);
            }
            setTimeout(function () {
                let check_archives = document.getElementById("tables").getElementsByTagName("dd");
                // @ts-ignore
                for (var item of check_archives) {
                    item.style.float = "left"
                }
            }, 500)
        },
        refreshChooseTables (state, tables) {
            // @ts-ignore
            state.chooseTables = [];
            for (var key of tables) {

                var table = this.state.tables.find(item => item===key);

                if (table) {
                    // @ts-ignore
                    state.chooseTables.push({
                        "name": table,
                        "nameUpperCase": formatToHump(titleCase(table)),
                        "annotation": "",
                        "columns":[]
                    });
                }
            }
        },
        flashFtls (state) {
            // @ts-ignore
            state.ftls = [];
        },
        addFtl (state, ftl) {
            // @ts-ignore
            state.ftls.push(ftl);
        },
        saveFtl (state, options) {
            const getFtl = (project, options) => {
                let ftlOld = null;
                if (!project) {
                    return null;
                }
                if (project.id == options.projectId) {
                    ftlOld = project.ftls.find(item => {
                        return item.id === options.ftl.id
                    })
                }
                if (!ftlOld) {
                    for(var childProject of project.children) {
                        ftlOld = getFtl(childProject, options);
                        if (ftlOld) {
                            return ftlOld;
                        }
                    }
                } else {
                    return ftlOld;
                }
                return null;
            }
            // @ts-ignore
            let ftlOld = getFtl(state.project, options);
            if (ftlOld) {
                for(var key in options.ftl) {
                    ftlOld[key] = options.ftl[key]
                }
            }
        },
        refreshProjects (state, projects) {
            // @ts-ignore
            state.projects = projects;
        },
        saveProject (state, project) {
            // @ts-ignore
            let projectOld = state.projects.find(item => {
                return item.id === project.id
            })
            if (projectOld) {
                for(var key in project) {
                    projectOld[key] = project[key]
                }
            }
        },
        changeActiveStep (state, n) {
            // @ts-ignore
            state.activeStep = n;
        },
        refreshTreeData (state, refreshTreeData) {
            // @ts-ignore
            state.treeData = refreshTreeData;
        },
        refreshProject (state, projectId) {
            if (projectId <= 0) {
                return
            }
            getProject({
                id : projectId
            }).then(function (res) {
                // @ts-ignore
                if (res.code === 0) {
                    if (res.data && res.data.length > 0) {
                        // @ts-ignore
                        state.project = res.data[0];
                        // @ts-ignore
                        state.project.name = state.baseParams.projectName;
                    }
                } else {
                    // @ts-ignore
                    layer.msg(res.msg, { icon : 2, time: 1000})
                }
            })
        },
        previewProjectTree (state, flag) {
            // @ts-ignore
            state.preview = flag
        },
    }
})

