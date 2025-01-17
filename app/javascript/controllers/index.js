// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application"

import ImagePreviewController from "./image_preview_controller"
application.register("image-preview", ImagePreviewController)

import KeywordsController from "./keywords_controller"
application.register("keywords", KeywordsController)

import RailsNestedForm from '@stimulus-components/rails-nested-form'
application.register('post-section', RailsNestedForm)

import NavBarController from "./navbar_controller"
application.register('navbar', NavBarController)