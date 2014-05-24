package com.kaviddiss.todo

import org.grails.databinding.BindingFormat

class Task {

    int priority
    String name
    TaskStatus status = TaskStatus.CREATED
    @BindingFormat('yyyy-MM-dd')
    Date dueDate
    
    static belongsTo = [ owner: User ]
    static constraints = {
        name nullable: false
        status nullable: false
    }
}
