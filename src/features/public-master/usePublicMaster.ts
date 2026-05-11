'use client';

import { useEffect, useState } from 'react';
import { fetchPublicMasterData } from './api';
import { mapPublicMasterToViewModel, type PublicMasterViewModel } from './mapper';
import type { PublicMasterData } from './types';

const INITIAL_VIEW_MODEL: PublicMasterViewModel = {
  roleOptions: [{ id: 'dps', label: 'DPS' }, { id: 'support', label: 'サポート' }],
  characterOptions: [{ id: '', label: '共通' }, { id: 'alice', label: 'Alice（要確認）' }, { id: 'bob', label: 'Bob（要確認）' }],
  statusOptions: [],
  scoreWeightCount: 0,
};

type PublicMasterState = { loading: boolean; warning: string | null; viewModel: PublicMasterViewModel; data: PublicMasterData | null; source: 'remote' | 'fallback' | null };

export function usePublicMaster(): PublicMasterState {
  const [state, setState] = useState<PublicMasterState>({ loading: true, warning: null, viewModel: INITIAL_VIEW_MODEL, data: null, source: null });

  useEffect(() => {
    let active = true;
    fetchPublicMasterData().then((result) => {
      if (!active) return;
      setState({ loading: false, warning: result.warning, viewModel: mapPublicMasterToViewModel(result.data), data: result.data, source: result.source });
    });
    return () => { active = false; };
  }, []);

  return state;
}
