class UrlMappings {

	static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }
        "/api/task"(controller: "task", action:'list', method:'GET')
        "/api/task"(controller: "task", action:'save', method:'POST')
        "/api/task/$id"(controller: "task", action:'update', method:'POST')
        "/api/task/$id"(controller: "task", action:'delete', method:'DELETE')

        "/"(view:"/index")
        "500"(view:'/error')
	}
}
