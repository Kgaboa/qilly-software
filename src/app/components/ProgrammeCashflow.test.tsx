// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgrammeCashflow } from '@/app/components/ProgrammeCashflow';
import type { BoqProgrammeGroup } from '@/utils/boqProgramme';

const groups: BoqProgrammeGroup[] = [
  {id:1,name:'Earthworks',sourceCodes:['EW01'],value:400,share:40,requiresReview:true},
  {id:2,name:'Roadworks',sourceCodes:['RD01'],value:600,share:60,requiresReview:true}
];

describe('BOQ-driven programme and S-Curve UI integration', () => {
  it('generates work packages from eligible BOQ total and reconciles final cumulative spend', () => {
    render(<ProgrammeCashflow projectValue={1200} durationMonths={4} boqGroups={groups} eligibleValue={1000} excludedCount={1}/>);
    fireEvent.click(screen.getByRole('button',{name:'Open planning scenario'}));
    fireEvent.click(screen.getByRole('button',{name:'Generate work packages from priced BOQ'}));
    expect(screen.getByText(/Scenario value: R 1,000.00/)).toBeTruthy();
    expect(screen.getByText(/1 excluded lines/)).toBeTruthy();
    expect(screen.getByText(/R 1,000.00 of R 1,200.00 is eligible/)).toBeTruthy();
    expect(screen.getByRole('img',{name:'Planned cumulative expenditure S-Curve'})).toBeTruthy();
    expect(screen.getByText('100.0%')).toBeTruthy();
  });
  it('prevents generating work packages without eligible BOQ values', () => {
    render(<ProgrammeCashflow projectValue={1200} durationMonths={4} boqGroups={[]} eligibleValue={0}/>);
    fireEvent.click(screen.getByRole('button',{name:'Open planning scenario'}));
    expect((screen.getByRole('button',{name:'Generate work packages from priced BOQ'}) as HTMLButtonElement).disabled).toBe(true);
  });
  it('masks project-value forecasts for restricted access', () => {
    render(<ProgrammeCashflow projectValue={1200} durationMonths={4} boqGroups={groups} eligibleValue={1000} isMasked/>);
    fireEvent.click(screen.getByRole('button',{name:'Open planning scenario'}));
    expect(screen.getByText(/Upgrade access is required/)).toBeTruthy();
    expect(screen.queryByRole('img',{name:'Planned cumulative expenditure S-Curve'})).toBeNull();
  });
});
