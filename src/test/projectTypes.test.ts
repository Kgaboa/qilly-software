import { describe, expect, it } from 'vitest';
import { CONTRACTOR_PROJECT_TYPES } from '@/utils/projectTypes';
import { getTemplatesByProjectType } from '@/utils/boqTemplates';

describe('contractor project type template coverage', () => {
  it.each(CONTRACTOR_PROJECT_TYPES)(
    'provides at least one training template for %s',
    projectType => {
      expect(getTemplatesByProjectType(projectType).length).toBeGreaterThan(0);
    }
  );
});
