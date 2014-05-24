import com.kaviddiss.todo.*

import grails.converters.*

class BootStrap {

    def init = { servletContext ->
        initJsonConverters()
        initUsers()
        initTasks()
    }
    def destroy = {
    }
    
    void initJsonConverters() {
        JSON.registerObjectMarshaller(Task) {
          def map= [:]
          map['id'] = it.id
          map['name'] = it.name
          map['priority'] = it.priority
          map['dueDate'] = it.dueDate.format('yyyy-MM-dd')
//          map['dueDate'] = it.dueDate
          map['status'] = it.status.toString()
          return map 
        }
    }
    
    void initUsers() {
      def adminRole = new Role(authority: 'ROLE_ADMIN').save(flush: true)
      def userRole = new Role(authority: 'ROLE_USER').save(flush: true)

      def testUser = new User(username: 'me', password: 'password')
      testUser.save(flush: true)

      UserRole.create testUser, userRole, true

      assert User.count() == 1
      assert Role.count() == 2
      assert UserRole.count() == 1
    }
    
    void initTasks() {
        User testUser = User.findByUsername('me')
        
        for (int i in 1..50) {
            new Task(owner:testUser, name: "task $i", priority: i % 3, dueDate: new Date()).save(flush: true)
        }
    }
}
