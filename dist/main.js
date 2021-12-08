"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const transform_intercepter_1 = require("./transform.intercepter");
const common_2 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_2.Logger();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalInterceptors(new transform_intercepter_1.TransformInterceptor());
    const port = process.env.PORT;
    await app.listen(port);
    logger.log(`Application listening on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map