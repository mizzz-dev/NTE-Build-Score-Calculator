import type { PublicMasterData } from './types';

export type MasterOption = { id: string; label: string };
export type PublicMasterViewModel = {
  roleOptions: MasterOption[];
  characterOptions: MasterOption[];
  statusOptions: MasterOption[];
  scoreWeightCount: number;
};

export function mapPublicMasterToViewModel(data: PublicMasterData): PublicMasterViewModel {
  return {
    roleOptions: data.roles.map((role) => ({ id: role.code, label: role.displayName })),
    characterOptions: [{ id: '', label: '共通' }, ...data.characters.filter((character) => character.slug !== 'default').map((character) => ({ id: character.slug, label: character.displayName }))],
    statusOptions: data.statuses.map((status) => ({ id: status.code, label: status.displayName })),
    scoreWeightCount: data.scoreWeights.length,
  };
}
