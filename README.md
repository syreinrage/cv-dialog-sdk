cv-dialog-sdk
=========
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


This is the Catavolt Javascript Software Development Kit

This SDK provides easier access to the [Dialog REST API (OpenApi)](https://dialog.hxgn-api.net/v0/openapi.yaml)
which can be viewed with an [OpenApi Viewer/Editor](http://editor.swagger.io)

## Installation
npm install --save cv-dialog-sdk  


### The Catavolt Dialog Model
The Catavolt Dialog Model represents an '***Abstract User Interface***', managed by the server, and delivered to the 
client (this SDK) to be used as an instruction set for rendering the client's UI.  This system differs subtley, but 
 significantly from traditional client/server architectures in that rather than targeting a specific resource (i.e. 
 next page), the client simply asks the server to redirect it to the 'next' resource (often without knowing 
 specifically what that resource will be).  
 
The **Dialog** abstraction itself, is a metaphor for a current channel of communication or more simply, a current 
resource.  A **Dialog** contains information describing the UI itself, as well as any 'business data' that should be 
displayed.  A **Redirection** is a pointer to the next **Dialog**.  An **Action** is a submission or instruction to the
server (to do 'something').  
A typical **Dialog** application flow is comprised of:  


1) Asking the server for a **Redirection** to a **Dialog** (e.g. rendered as an Html Page)
2) Performing an **Action** on the **Dialog** (e.g. user clicks a link) 
3) Receiving a **Redirection** to the next **Dialog** (e.g. resulting Page is shown)

### Workbenches and Workbench Actions
A Dialog flow is initiated by performing a **WorkbenchAction**.  A given user may have one or more **Workbench**es 
which may have one or more **WorkbenchAction**s.  These provide entry points into the various application flows and can
 be thought of as initial 'Menus' with 'Menu Items'.  Performing a **WorkbenchAction** will begin the **Dialog** 
 application flow as described above.
 
 ### Types of Dialogs
 **Dialog**s will always be one of two subtypes:  
 1) An **EditorDialog**  
 This type of **Dialog** is associated with one, single 'data record'   
 E.g.  Viewing the 'Details' of a single list item  
 2) A **QueryDialog** is associated with a list of 'data records'  
 E.g.  Viewing a tabular list or a map with location points  
 
### Views and Records
A **Dialog** is always associated with a **View** and one or more **Records**.  **View**s represent various ways
 of displaying the 'data record(s)' to the user.  **View**s themselves DO NOT contain the 'data record(s)',
  only information about how it 
should be displayed.  
Some types of Views are:
1) **Details** (Properties)
2) **List**
3) **Form** (Layout other Views)
4) **Map**
5) **Graph** (or chart)  

**Record**s contain the actual business data for display and may be combined with the display metadata provided by 
the **View**, to render the UI.  
* A single **Record** may be retrieved directly from an **EditorDialog**, following a **read()** operation.  
* Multiple **Records** may be retrieved as a **RecordSet** from a **QueryDialog** via the query() method.
  However, a **QueryScroller** may also be obtained from the **QueryDialog**, and provides a buffer with record 
  pagining functionality.
 
 ### Dialog Hierarchies
**Dialog**s may be composed of one or more 'child' **Dialog**s. This is typically used to layout a 
'Form', such that the top-level is **Dialog** is an **EditorDialog** with a **Form** **View** .  The **EditorDialog**
 will also have a list of 'child' **Dialog**s which will contain the **View**s to be arranged based on the **Form** 
 **View**'s metadata.
* When retrieving a new **Dialog** (i.e. following a **DialogRedirection**), the top-level **Dialog** will be an 
**EditorDialog** with a **Form** **View**
* This **Dialog**'s 'child' **Dialogs** will typically be used to compose the UI (**Lists**, Details, Maps, etc.)

  
### Menus and Actions
**View**s are associated with a **Menu**, which may in turn have a list of 'child' **Menu**s, enabling a hierarchical
 representation of nested menus and menu items.  A **Menu** may also have an '**actionId**' which can be used to 
 'perform an Action' on the associated **Dialog**, typically resulting in the server returning a **Redirection** to 
 another **Dialog** (i.e. resource, page, etc.)
 * **Actions** are used to transition from one **Dialog** to the next.
 * **actionId**s are simply strings but are typically retrieved from **Menu**s associated with a **View*````````*


## Dialog model is [here](https://rawgit.com/catavolt-oss/cv-dialog-sdk/master/docs/dialog_model.pdf)
## (early) Api Docs are [here](https://rawgit.com/catavolt-oss/cv-dialog-sdk/master/docs/cv-dialog-sdk/index.html)


