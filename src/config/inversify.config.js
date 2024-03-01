// User-land modules.
import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'

// Application modules.
import { AuthController } from '../controllers/AuthController.js'
import { AuthService } from '../services/AuthService.js'
import { ResourceController } from '../controllers/ResourceController.js'
import { ResourceService } from '../services/ResourceService.js'

// Define the types to be used by the IoC container.
export const TYPES = {
  AuthController: Symbol.for('AuthController'),
  AuthService: Symbol.for('AuthService'),
  ResourceController: Symbol.for('ResourceController'),
  ResourceService: Symbol.for('ResourceService')
}

// Declare the injectable and its dependencies.
decorate(injectable(), AuthService)
decorate(injectable(), AuthController)
decorate(injectable(), ResourceController)
decorate(injectable(), ResourceService)

decorate(inject(TYPES.AuthService), AuthController, 0)
decorate(inject(TYPES.ResourceService), ResourceController, 0)

// Create the IoC container.
export const container = new Container()

// Declare the bindings.
container.bind(TYPES.AuthController).to(AuthController).inSingletonScope()
container.bind(TYPES.AuthService).to(AuthService).inSingletonScope()
container.bind(TYPES.ResourceController).to(ResourceController).inSingletonScope()
container.bind(TYPES.ResourceService).to(ResourceService).inSingletonScope()
