import { Validators } from "@angular/forms";

export const MAX_NUM_OF_NODES = 10;

export const INPUT_VALIDATION_POSITIVE_NUMBER = [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)];
export const INPUT_VALIDATION_POSITIVE_FLOAT = [Validators.required, Validators.pattern('^[0-9.]*$'), Validators.min(0)];

export const INPUT_VALIDATION_CPU_CORE = [Validators.required, Validators.pattern('^[0-9.]*$'), Validators.min(0.000001)];
export const INPUT_VALIDATION_NETWORK_LOAD = [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(0)];
export const INPUT_VALIDATION_PRICE_PER_TICK = [Validators.required, Validators.pattern('^[0-9.eE-]*$'), Validators.min(0)];
export const INPUT_VALIDATION_NAME = [Validators.required, Validators.pattern('^[a-zA-Z0-9._]*$')];
