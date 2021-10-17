import "reflect-metadata";

import { describe } from "mocha";
import {
  IsString,
  IsOptional,
  IsEmail,
  ValidateNested,
  IsObject,
} from "class-validator";

import { Exclude, Expose } from "class-transformer";
import { Type } from "class-transformer";
import { ServerValidationService } from "./validation.service";
import { expect } from "chai";

class NestedObject {
  @IsString()
  nestedProperty: string;

  @IsOptional()
  @IsString()
  nestedOptional: string;
}

class DemoValidationSchema {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  @Exclude()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => NestedObject)
  optional: NestedObject;
}

let validationService: ServerValidationService;

describe("Test Plain Object validation helper", () => {
  before((done) => {
    validationService = new ServerValidationService();
    done();
  });

  it("Validate a valid object without optional parameter. Should pass", (done) => {
    const data = {
      name: "mairingdao",
      email: "test@gmail.com",
      password: "passwo3d",
    };

    try {
      const validData = validationService.validateResponseObject(
        DemoValidationSchema,
        data
      );
      expect(validData).to.have.keys(["name", "email", "password"]);
      done();
    } catch (err) {
      done(err);
    }
  });
  it("Validate a valid object with extra parameters. Should pass with extra parameter removed", (done) => {
    const data = {
      name: "mairingdao",
      email: "test@gmail.com",
      password: "passwo3d",
      extra1: "extra1",
      extra2: "extra2",
    };

    try {
      const validData = validationService.validateResponseObject(
        DemoValidationSchema,
        data
      );
      expect(validData).to.have.keys(["name", "email", "password"]);
      expect(validData).to.not.have.keys(["extra1", "extra2"]);
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Validate a invalid object with string(password) passed as a number. Should throw an error", (done) => {
    const data = {
      name: "mairingdao",
      email: "test@gmail.com",
      password: 123,
      extra1: "extra1",
      extra2: "extra2",
    };

    try {
      const validData = validationService.validateResponseObject(
        DemoValidationSchema,
        data
      );

      done(new Error("This test should fail"));
    } catch (err) {
      done();
    }
  });

  it("Validate a invalid email. Should throw an error", (done) => {
    const data = {
      name: "mairingdao",
      email: "test@@gmail.com",
      password: 123,
      extra1: "extra1",
      extra2: "extra2",
    };

    try {
      const validData = validationService.validateResponseObject(
        DemoValidationSchema,
        data
      );

      done(new Error("This test should fail"));
    } catch (err) {
      done();
    }
  });

  it("Validate nested objects.  without optional nested prop. Should Pass", (done) => {
    const data = {
      name: "mairingdao",
      email: "test@gmail.com",
      password: "password",
      optional: {
        nestedProperty: "Some Prop",
      },
    };

    try {
      const validData = validationService.validateResponseObject(
        DemoValidationSchema,
        data
      );

      expect(validData).to.have.keys(["name", "email", "password", "optional"]);

      expect(validData.optional).to.have.keys(["nestedProperty"]);
      done();
    } catch (err) {
      done(err);
    }
  });

  it("Validate nested objects.  with valid/optional nested prop. Should Pass", (done) => {
    const data = {
      name: "mairingdao",
      email: "test@gmail.com",
      password: "password",
      optional: {
        nestedProperty: "Some Prop",
        nestedOptional: "optional prop",
      },
    };

    try {
      const validData = validationService.validateResponseObject(
        DemoValidationSchema,
        data
      );

      expect(validData).to.have.keys(["name", "email", "password", "optional"]);

      expect(validData.optional).to.have.keys([
        "nestedProperty",
        "nestedOptional",
      ]);

      done();
    } catch (err) {
      done(err);
    }
  });
});
