import fs from "fs";
import ora from "ora";
import path from "path";
import readline from "readline";

type ModuleContentGenerator = (
  moduleName: string,
  moduleNameCased: string
) => string;

const moduleContentGenerators: Record<string, ModuleContentGenerator> = {
  service: (
    moduleName,
    moduleNameCased
  ) => `import { I${moduleNameCased} } from "./${moduleName}.interface";
import { ${moduleNameCased} } from "./${moduleName}.models";

const create${moduleNameCased} = async (payload: Partial<I${moduleNameCased}>) => {
  return await ${moduleNameCased}.create(payload);
};

const getAll${moduleNameCased} = async () => {
  return await ${moduleNameCased}.find().lean();
};

const get${moduleNameCased}ById = async (id: string) => {
  return await ${moduleNameCased}.findById(id).lean();
};

const update${moduleNameCased} = async (id: string, payload: Partial<I${moduleNameCased}>) => {
  return await ${moduleNameCased}.findByIdAndUpdate(id, payload, { new: true });
};

const delete${moduleNameCased} = async (id: string) => {
  return await ${moduleNameCased}.findByIdAndDelete(id);
};

export const ${moduleName}Service = {
  create${moduleNameCased},
  getAll${moduleNameCased},
  get${moduleNameCased}ById,
  update${moduleNameCased},
  delete${moduleNameCased},
};`,

  controller: (
    moduleName,
    moduleNameCased
  ) => `import { Request, Response } from "express";
import { handleAsync } from "../../utils/handleAsync";
import { ${moduleName}Service } from "./${moduleName}.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const create${moduleNameCased} = handleAsync(async (req: Request, res: Response) => {
  const result = await ${moduleName}Service.create${moduleNameCased}(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "${moduleNameCased} successfully created",
    data: result,
  });
});

const getAll${moduleNameCased} = handleAsync(async (_req: Request, res: Response) => {
  const result = await ${moduleName}Service.getAll${moduleNameCased}();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "${moduleNameCased}s retrieved successfully",
    data: result,
  });
});

const get${moduleNameCased}ById = handleAsync(async (req: Request, res: Response) => {
  const result = await ${moduleName}Service.get${moduleNameCased}ById(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "${moduleNameCased} retrieved successfully",
    data: result,
  });
});

const update${moduleNameCased} = handleAsync(async (req: Request, res: Response) => {
  const result = await ${moduleName}Service.update${moduleNameCased}(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "${moduleNameCased} updated successfully",
    data: result,
  });
});

const delete${moduleNameCased} = handleAsync(async (req: Request, res: Response) => {
  const result = await ${moduleName}Service.delete${moduleNameCased}(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "${moduleNameCased} deleted successfully",
    data: result,
  });
});

export const ${moduleName}Controller = {
  create${moduleNameCased},
  getAll${moduleNameCased},
  get${moduleNameCased}ById,
  update${moduleNameCased},
  delete${moduleNameCased},
};`,

  route: (moduleName, moduleNameCased) => `import { Router } from "express";
import { ${moduleName}Controller } from "./${moduleName}.controller";

const router: Router = Router();

router.post("/create", ${moduleName}Controller.create${moduleNameCased});
router.get("/", ${moduleName}Controller.getAll${moduleNameCased});
router.get("/:id", ${moduleName}Controller.get${moduleNameCased}ById);
router.patch("/update/:id", ${moduleName}Controller.update${moduleNameCased});
router.delete("/delete/:id", ${moduleName}Controller.delete${moduleNameCased});

export const ${moduleName}Routes = router;`,

  interface: (
    _moduleName,
    moduleNameCased
  ) => `import { Types } from "mongoose";

export interface I${moduleNameCased} {
  _id: Types.ObjectId;
}
`,

  models: (
    moduleName,
    moduleNameCased
  ) => `import { model, Schema } from "mongoose";
import { I${moduleNameCased} } from "./${moduleName}.interface";

const ${moduleName}Schema = new Schema<I${moduleNameCased}>({});

export const ${moduleNameCased} = model<I${moduleNameCased}>("${moduleNameCased}", ${moduleName}Schema);
`,

  dto: (_moduleName, moduleNameCased) => `import { z } from "zod";

export const create${moduleNameCased}Schema = z.object({});
export const update${moduleNameCased}Schema = create${moduleNameCased}Schema.partial();

export type Create${moduleNameCased}DTO = z.infer<typeof create${moduleNameCased}Schema>;
export type Update${moduleNameCased}DTO = z.infer<typeof update${moduleNameCased}Schema>;
`,
};

function createModule(moduleName: string): void {
  const spinner = ora(`Creating module "${moduleName}"...`).start();

  try {
    const folderPath = path.join("src", "modules", moduleName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const files = [
      `${moduleName}.controller.ts`,
      `${moduleName}.interface.ts`,
      `${moduleName}.models.ts`,
      `${moduleName}.route.ts`,
      `${moduleName}.service.ts`,
      `${moduleName}.dto.ts`,
    ];

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const fileType = file.split(".").slice(-2, -1)[0] as string;
      const moduleNameCased =
        moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

      const generator =
        moduleContentGenerators[
          fileType as keyof typeof moduleContentGenerators
        ];
      if (generator) {
        const content = generator(moduleName, moduleNameCased);
        fs.writeFileSync(filePath, content, "utf8");
      } else {
        fs.writeFileSync(filePath, "", "utf8");
      }
    });

    spinner.succeed(`Module "${moduleName}" created successfully.`);
  } catch (error) {
    if (error instanceof Error) {
      spinner.fail(`Error creating module: ${error.message}`);
    } else {
      spinner.fail("An unknown error occurred.");
      console.error(error);
    }
  }
}

function updateRouteIndex(moduleName: string): void {
  const routesFile = path.join("src", "routes", "index.ts");
  const importLine = `import { ${moduleName}Routes } from "../modules/${moduleName}/${moduleName}.route";`;
  const routeEntry = `{ path: "/${moduleName}", route: ${moduleName}Routes },`;

  let content = fs.readFileSync(routesFile, "utf8");

  if (!content.includes(importLine)) {
    const importInsertPos = content.indexOf("const router");
    content =
      content.slice(0, importInsertPos).trimEnd() +
      "\n" +
      importLine +
      "\n\n" +
      content.slice(importInsertPos).trimStart();
  }

  const marker = "const moduleRoutes = [";
  const markerPos = content.indexOf(marker) + marker.length;

  if (!content.includes(routeEntry)) {
    const before = content.slice(0, markerPos).trimEnd();
    const after = content.slice(markerPos).trimStart();

    content = before + "\n  " + routeEntry + "\n  " + after;
  }

  fs.writeFileSync(routesFile, content, "utf8");
}

function promptUser(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the module name: ", (moduleName) => {
    createModule(moduleName);
    updateRouteIndex(moduleName);
    rl.close();
  });
}

promptUser();
