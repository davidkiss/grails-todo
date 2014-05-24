package com.kaviddiss.todo

import grails.converters.*
import grails.rest.RestfulController
import grails.transaction.*
import grails.plugin.springsecurity.annotation.Secured

import static org.springframework.http.HttpStatus.*
import static org.springframework.http.HttpMethod.*

@Secured(['ROLE_USER'])
@Transactional(readOnly = true)
class TaskController extends RestfulController {

    static allowedMethods = [list:'GET',
                             save:['POST'],
                             update:['POST'],
                             delete:['DELETE']]
    static responseFormats = ['json', 'xml']
    static defaultAction = "list"
    
    def springSecurityService
    
    TaskController() {
        super(Task)
    }
    
    private User getCurrentUser() {
        User.get(springSecurityService.principal.id)
    }
    
    def list(Integer limit) {
        User user = getCurrentUser()        
        params.max = Math.min(limit ?: 5, 100)
        params.offset = Math.max(params.offset ? params.offset as int : 0, 0)
        println "query params: $params"
        render (text: [ list: Task.findAllByOwner(user, params), count: Task.countByOwner(user) ] as JSON, contentType: 'application/json')
    }

    @Transactional
    def save(Task task) {
        // ensuring ownership doesn't change:
        User user = getCurrentUser()        
        task.owner = user
        
        if (task.save(flush: true)) {
            render task
        } else {
            render status: BAD_REQUEST
        }
    }
    
    @Transactional
    def update(Task task) {
        // ensuring ownership doesn't change:
        User user = getCurrentUser()        
        task.owner = user
        if (task == null) {
            render status: NOT_FOUND
        } else if (task.save(flush: true)) {
            render status: OK
        } else {
            println "task: $task.errors"
            render status: BAD_REQUEST
        }
    }
    
    @Transactional
    def delete() {
        Task task = Task.get(params.id)
        if (task == null) {
            println "not found"
            render status: NOT_FOUND
        } else {
            task.delete(flush: true)
            render status: NO_CONTENT
        }
    }
}
